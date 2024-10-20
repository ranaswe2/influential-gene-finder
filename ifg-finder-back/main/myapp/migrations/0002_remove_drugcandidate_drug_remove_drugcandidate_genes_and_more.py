# Generated by Django 5.1.1 on 2024-09-28 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='drugcandidate',
            name='drug',
        ),
        migrations.RemoveField(
            model_name='drugcandidate',
            name='genes',
        ),
        migrations.RemoveField(
            model_name='influentialgene',
            name='adjusted_p_val',
        ),
        migrations.RemoveField(
            model_name='influentialgene',
            name='gene',
        ),
        migrations.RemoveField(
            model_name='influentialgene',
            name='p_val',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_login',
        ),
        migrations.AddField(
            model_name='influentialgene',
            name='ifg_file_path',
            field=models.FileField(blank=True, null=True, upload_to='ifg_files/'),
        ),
        migrations.AlterField(
            model_name='drugcandidate',
            name='dsigdb_path',
            field=models.FileField(blank=True, null=True, upload_to='dsigdb_files/'),
        ),
    ]
