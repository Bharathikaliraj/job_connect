from django.db import models
from django.conf import settings


class Job(models.Model):

    title = models.CharField(max_length=100)

    company = models.CharField(max_length=100)

    location = models.CharField(max_length=100)

    salary = models.CharField(max_length=50)

    description = models.TextField()

    skills = models.CharField(max_length=255)

    job_type = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    posted_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="posted_jobs"
)
    
class JobApplication(models.Model):


    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    applicant_name = models.CharField(max_length=100)

    applicant_email = models.EmailField()

    cover_letter = models.TextField(blank=True)

    
    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ("Applied", "Applied"),
            ("Shortlisted", "Shortlisted"),
            ("Rejected", "Rejected"),
            ("Selected", "Selected"),
        ],
        default="Applied"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} - {self.job.title}"
