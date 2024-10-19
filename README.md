# Introduction
Cancer is one of the major public health threats and potentially fatal diseases worldwide. So,
our goal in this project is to identify influential genes (IFGs) associated with cancer as well as explore
potential drug candidates using a combination of statistical and machine learning methods.
We conducted extensive analysis using microarray data from The Cancer Genome Atlas
(TCGA) dataset, derived from a comprehensive repository of genomic and clinical
information called cBioPortal to uncover genetic signatures involved in cancer development
and progression. We have applied some advanced statistical techniques such as
Kruskal-Wallis H test and Bonferroni correction methods to identify key genetic aberrations.
After that, we identified potential drug candidates by utilizing the identified IFGs by setting
the p-value < 0.05 and the highest number of IFGs enriched with each drug utilizing the
DSigDB database from Enrichr.

# Features
User Roles
## Admin
Create, Read, Update and Delete User data as well as other information
## General Users
1. Create Account and Access to Account
* User registration by providing e-mail and necessary data
* User can Upload profile Image
* User can Verify account through OTP
* User can Login through e-mail and password
* Forget & reset password
  
2. Analyzing Microarray Dataset
* User can Upload Microarray Dataset (Max size: 100MB)
* System Preprocess the dataset
* User can Find total number of genes and attributes

3. Finding IFGs
* User can check IFGs by providing appropriate splitting attribute
* User can download statistical Report
  
4. Finding Drug Candidates
* Using these IFGs, find DSigDB database from Enrichr
* Filter the P-values with 5% error tolerance rate
* User can download statistical Report

4. Authentication & Authorization
* User login and registration.
* Token-based authentication using JWT.
* Redirect users to login when accessing protected features 
5. Profile & History
* User can edit user data
* Users can view all previous history
  
# Technologies Used
## Frontend
* React - Version 18
* React-Router for navigation between pages.
* Bootstrap for responsive UI design.
## Backend
* Django REST Framework v5.0
* RESTful API services to interact with the frontend.
## Database
* MySQL
* Database for storing user data, database info and IFG records.
# Setup and Installation
* Django REST Framework v5.0 (Installed)
* Node.js 16.x or higher
* MySQL Server
* Python environment
# How to Run
* To run the back-end (Django) project, install python3 and nodeJS, start MySQL server. Then open command prompt in the ifg-finder-back project folder and then execute Django run command "py manage.py runserver".
* To run the front-end (ReactJS) project, open command prompt in the ifg-finder-front project folder and then execute ReactJS run command "npm start"

# Application Overview
## Home Page 
![Welcome](images/home.png)

## Registration
![Registration](images/register.png)

## Account Verification
![OTP](images/otp.png)

## Login
![Login](images/login.png)

## Dashboard
![Dashboard](images/dashboard.png)

## Influential Genes
![IFGs](images/ifgs.png)

## Drug Candidates
![Drug Candidates](images/drugc.png)

## Statistical Report
![Report](images/report.png)

## User Profile & History
![Profhis](images/profile.png)















