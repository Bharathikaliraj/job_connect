
from rest_framework import serializers
from .models import Job, JobApplication


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company = serializers.CharField(
        source="job.company",
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "job_title",
            "company",
            "applicant_name",
            "applicant_email",
            "cover_letter",
            "resume",
            "status",
            "applied_at",
        ]

        read_only_fields = ["id", "status", "applied_at"]
