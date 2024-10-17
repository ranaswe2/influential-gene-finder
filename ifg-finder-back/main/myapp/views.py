from django.shortcuts import render

import os
import csv
import time
import gseapy as gp
import random
import pandas as pd
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.parsers import JSONParser
from .models import User, InfluentialGene, DrugCandidate
from .serializers import UserSerializer
from django.utils import timezone
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from .models import Dataset
from .serializers import DatasetSerializer, DrugCandidateSerializer
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer, InfluentialGeneSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework import status
import pandas as pd
import numpy as np
from scipy.stats import kruskal
from statsmodels.stats.multitest import multipletests
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
import json

def send_passcode_email(user_email, passcode):
    subject = 'IFG Finder'
    from_email = settings.EMAIL_HOST_USER
    to_email = [user_email]

    context = {
        'passcode': passcode,
    }
    # Attach the email content
    html_content = render_to_string('email-template.html', context)
    
    email = EmailMultiAlternatives(subject, '', from_email, to_email)
    email.attach_alternative(html_content, "text/html")

    # Attach the logo
    # email.attach_file(r'media/others/Logo.png')
    email.send()

class SignupAPIView(APIView):
    
    permission_classes = [AllowAny]  # Allow anyone to access this view
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):

        password = request.data.get('password')
        hashed_password = make_password(password)
        request.data['password'] = hashed_password

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Handle the image file if present
            image = request.FILES.get('image_path')
            if image:
                # Save the image to the profile_images folder
                image_path = os.path.join('profile_images/', image.name)
                full_image_path = os.path.join(settings.MEDIA_ROOT, image_path)


                # Save the file to the designated folder
                with open(full_image_path, 'wb+') as destination:
                    for chunk in image.chunks():
                        destination.write(chunk)

                # Save the image path to the user object
                user.image_path = image_path
                user.save()

            # Generate OTP
            otp = random.randint(100000, 999999)
            user.otp = otp
            user.save()


            send_passcode_email(user.email, otp)

            return Response({'message': 'User registered, OTP sent to email.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class NewOtpAPIView(APIView):
    
    permission_classes = [AllowAny]  # Allow anyone to access this view

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if user exists with the given email
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Validate the request data with the UserSerializer (if needed)
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Generate OTP
            otp = random.randint(100000, 999999)

            # Assign the OTP to the user
            user.otp = otp
            user.save()

            # Send the OTP via email (implement your own email sending function)
            send_passcode_email(email, otp)

            return Response({'message': 'OTP sent to email.'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Verify OTP API
class VerifyOTPAPIView(APIView):
    
    permission_classes = [AllowAny]  # Allow anyone to access this view

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            user = User.objects.get(email=email)
            if user.otp == int(otp):
                user.is_verified = True
                user.save()
                return Response({'message': 'OTP verified, user is verified.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



# Login API View
class LoginAPIView(APIView):

    permission_classes = [AllowAny]  # Allow anyone to access this view

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)

            # Check if the user is verified and the password is correct
            if user.is_verified and check_password(password, user.password):
                # Set is_active to True on login
                user.is_active = True
                user.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class GetUserAPIView(APIView):

    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get(self, request, *args, **kwargs):
        # Get the authenticated user from the request
        user = request.user
        
        # Serialize the user data
        serializer = UserSerializer(user)
        
        # Return user data in response
        return Response(serializer.data, status=200)
    
class UpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def put(self, request, *args, **kwargs):
        # The authenticated user is already available via request.user
        user = request.user

        # Pass the user's data and the partial update flag to the serializer
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Save the changes
            serializer.save()
            return Response({
                "message": "User data updated successfully!",
                "user": serializer.data  # Return the updated user data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Invalid data",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        
class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not email or not new_password or not confirm_password:
            return Response({'error': 'Email and password fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Find user by email
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update password
        user.password = make_password(new_password)
        user.save()

        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
    
# Logout API View

class LogoutAPIView(APIView):

    permission_classes = [IsAuthenticated]  # Only allow authenticated users to logout

    def post(self, request):
        try:
            user = request.user  # Get the currently authenticated user
            
            # Check if the refresh_token is in the request data
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Set is_active to False on logout
            user.is_active = False
            user.save()

            # Blacklist the refresh token to invalidate the session
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# Preprocess the dataset by converting it to CSV and cleaning it
def preprocess_dataset(uploaded_file):
    # Read TSV and convert to CSV
    original_file_name = uploaded_file.name  # Get the original file name as a string
    processed_file_name = original_file_name.replace(".txt", ".csv")

    # Read the file content directly from the uploaded file
    df = pd.read_csv(uploaded_file, sep='\t')
    
    # Remove 'NA' rows
    df = df.dropna()
    
    # Rename columns and rows
    new_columns = [''] + [f'x{i}' for i in range(1, len(df.columns))]
    df.columns = new_columns
    # df.iloc[:, 0] = [str(i) for i in range(1, len(df) + 1)]
    # df.index = [i for i in range(1, len(df) + 1)]
    
    timestamp = str(int(time.time()))

    # Save the preprocessed dataset as CSV in the 'datasets/' directory
    processed_file_name = uploaded_file.name.replace(".txt", f"_{timestamp}_preprocessed.csv")
    processed_file_path = os.path.join(settings.MEDIA_ROOT, 'datasets', processed_file_name)
    df.to_csv(processed_file_path, index=False)

    return processed_file_name  # Return the name so Django can handle it


class DatasetUploadView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = DatasetSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        user_id = request.user.id  # assuming user ID is passed in the request
        uploaded_file = request.FILES.get('dataset_path')
        disease_name = request.data.get('disease')

        if not uploaded_file:
            return Response({"error": "File not provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Preprocess dataset (you may keep this or modify as needed)
        processed_file_path = preprocess_dataset(uploaded_file)

        # Save to database using Django's FileField storage system
        dataset = Dataset.objects.create(
            user_id=user_id,
            disease=disease_name,
            dataset_path=f"datasets/{processed_file_path}"  # This automatically saves to the right folder
        )

        # Retrieve the `id` of the saved dataset
        dataset_id = dataset.id

        return Response({
            "message": "Dataset uploaded and preprocessed successfully",
            "dataset": DatasetSerializer(dataset).data,  # This includes all fields
            "dataset_id": dataset_id  # Include the ID separately if you want
        }, status=status.HTTP_201_CREATED)


# Viewset for Dataset management (CRUD operations) ok 
class DatasetViewSet(viewsets.ModelViewSet):
    
    permission_classes = [AllowAny] 
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        dataset = self.get_object()
        file_path = request.data.get('file_path')

        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type='text/csv')
                response['Content-Disposition'] = f'attachment; filename={os.path.basename(file_path)}'
                return response
        else:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

# Example of a list and retrieve views for APIs
class DatasetListView(generics.ListAPIView):
    
    permission_classes = [AllowAny] 
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer

class DatasetDetailView(generics.RetrieveAPIView):
    
    permission_classes = [AllowAny] 
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer



class InfluentialGeneAPIView(APIView):

    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        dataset_id = request.data.get('dataset_id')  # Assuming dataset_id is passed or fixed
        splitting_columns = int(request.data.get('splitting_columns')) 

        # Fetch dataset
        try:
            dataset = Dataset.objects.get(id=dataset_id)
            relative_path = dataset.dataset_path

            # Construct the full path by joining MEDIA_ROOT with the relative path
            full_path = os.path.join(settings.MEDIA_ROOT, str(relative_path))

            # Now you can open the file using the full path
            if os.path.exists(full_path):
                data = pd.read_csv(full_path, index_col=0)
            else:
                return Response({"error": f"Failed to read dataset: {full_path} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found"}, status=status.HTTP_404_NOT_FOUND)

        alpha = 0.05
        pvals = []
        significant_genes_lt_alpha = []


        for i in range(len(data)):
            vec1 = data.iloc[i, :splitting_columns].astype(float)  # Control Part
            vec2 = data.iloc[i, splitting_columns:].astype(float)  # Treatment Part

            # Filter missing and non-positive values before logarithm
            vec1 = vec1[~np.isnan(vec1) & (vec1 > 0)]
            vec2 = vec2[~np.isnan(vec2) & (vec2 > 0)]

            # Apply logarithm (base 2)
            vec1 = np.log2(vec1)
            vec2 = np.log2(vec2)

            # Apply the Kruskal-Wallis test
            try:
                tt = kruskal(vec1, vec2)
                pval = tt.pvalue
            except ValueError:
                print(f"Error calculating p-value for gene {data.index[i]}")
                pval = np.nan  # Assign NaN for failed calculation

            pvals.append(pval)  # Store p-value

        # Step 3: Adjust p-values using Bonferroni correction
        reject, adjusted_pvals, _, _ = multipletests(pvals, method='bonferroni')

        # Step 4: Identify significant genes based on adjusted p-values

        for i, pval in enumerate(pvals):
            if adjusted_pvals[i] <= alpha:
                significant_genes_lt_alpha.append({"Gene": data.index[i], "p-value": pval, "Adjusted p-value": adjusted_pvals[i]})

        # Convert the list of significant genes to a DataFrame
        significant_genes_df = pd.DataFrame(significant_genes_lt_alpha)

        # Save the DataFrame to a CSV file
        timestamp = str(int(time.time()))
        csv_file_name = f"significant_genes_{timestamp}.csv"
        ifg_file_path = os.path.join(settings.MEDIA_ROOT, 'ifg_files', csv_file_name)

        significant_genes_df.to_csv(ifg_file_path, index=False)

        # Save the path of the CSV file to the InfluentialGene model
        influential_gene = InfluentialGene.objects.create(
            dataset=dataset,
            splitting_columns=splitting_columns,
            ifg_file_path=f'ifg_files/{csv_file_name}'  # Store relative path
        )

        
        # Retrieve the `id` of the saved dataset
        influential_gene_id = influential_gene.id

        return Response({
            "message": "Influential genes calculated and saved.",
            "ifg_file": InfluentialGeneSerializer(influential_gene).data,
            "ifg_dataset_id": influential_gene_id 
        }, status=status.HTTP_201_CREATED)



class DrugCandidateAPIView(APIView):

    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        influentialgene_id = request.data.get('influentialgene_id')  # Get the InfluentialGene ID from the request

        # Validate if influentialgene_id is provided
        if not influentialgene_id:
            return Response({"error": "InfluentialGene ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Fetch the CSV file path from the InfluentialGene model
        try:
            influential_gene = InfluentialGene.objects.get(id=influentialgene_id)
            ifg_file_path = influential_gene.ifg_file_path  # Assuming this is the field storing the CSV path
            
        except InfluentialGene.DoesNotExist:
            return Response({"error": "InfluentialGene not found."}, status=status.HTTP_404_NOT_FOUND)

        # Step 3: Read the CSV file and extract the genes
        try:
            df = pd.read_csv(f"media/{ifg_file_path}")
            if 'Gene' not in df.columns:
                return Response({"error": "The CSV file does not contain a 'Gene' column."}, status=status.HTTP_400_BAD_REQUEST)

            genes = df['Gene'].tolist()  # Extract gene names from the 'Gene' column
        except Exception as e:
            return Response({"error": f"Error reading CSV file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Step 4: Perform enrichment analysis using gseapy
        try:
            enr = gp.enrichr(gene_list=genes, gene_sets=['DSigDB'])
        except Exception as e:
            return Response({"error": f"Error running gseapy enrichment: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not enr.results.empty:
            drug_matrix_results = enr.results
            DSigDB_df = drug_matrix_results[['Term', 'P-value', 'Genes']]

            # Step 5: Sort and filter the results based on p-value
            counts = DSigDB_df['Genes'].str.split(';').apply(len)
            DSigDB_df['Counts'] = counts
            filtered_data = DSigDB_df[DSigDB_df['P-value'] < 0.05]

            # Step 6: Save the filtered results to a CSV file
            csv_file_name = f"drug_candidates_{influentialgene_id}.csv"
            csv_file_path = f"dsigdb_files/{csv_file_name}"


            filtered_data.to_csv(f"media/{csv_file_path}", index=False)

            drug_candidate = DrugCandidate.objects.create(
                influentialgene=influential_gene,
                dsigdb_path=csv_file_path
            )

            # Serialize and return the newly created DrugCandidate entry
            serializer = DrugCandidateSerializer(drug_candidate)
            return Response({
                "message": "Drug candidates generated successfully.",
                "drug_candidate": DrugCandidateSerializer(drug_candidate).data
            }, status=status.HTTP_201_CREATED)

        else:
            return Response({"error": "No results from enrichment analysis."}, status=status.HTTP_204_NO_CONTENT)
        



class UserFileInfoView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter datasets for the authenticated user
        return Dataset.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Manually building the response
        response_data = []
        for dataset in queryset:
            influential_genes = InfluentialGene.objects.filter(dataset=dataset)
            dataset_info = {
                "dataset_path": dataset.dataset_path.url if dataset.dataset_path else None,
                "influential_genes": []
            }

            # Loop through each influential gene associated with the dataset
            for gene in influential_genes:
                drug_candidates = DrugCandidate.objects.filter(influentialgene=gene)
                gene_info = {
                    "splitting_columns": gene.splitting_columns,
                    "ifg_file_path": gene.ifg_file_path.url if gene.ifg_file_path else None,
                    "drug_candidates": []
                }

                # Loop through each drug candidate associated with the influential gene
                for drug_candidate in drug_candidates:
                    candidate_info = {
                        "dsigdb_path": drug_candidate.dsigdb_path.url if drug_candidate.dsigdb_path else None
                    }
                    gene_info["drug_candidates"].append(candidate_info)
                
                dataset_info["influential_genes"].append(gene_info)

            response_data.append(dataset_info)
        
        return Response(response_data)