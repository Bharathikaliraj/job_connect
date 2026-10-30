from django.shortcuts import get_object_or_404
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer


@api_view(["GET"])
def job_list(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def apply_job(request):
    serializer = JobApplicationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = JobApplication.objects.filter(
        applicant_email__iexact=request.user.email
    ).order_by("-applied_at")

    serializer = JobApplicationSerializer(
        applications,
        many=True
    )

    return Response(serializer.data)


   
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_job(request):
    profile = getattr(request.user, "profile", None)

    if profile is None or profile.role != "recruiter":
        return Response(
            {"error": "Only recruiters can post jobs."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = JobSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(posted_by=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_posted_jobs(request):
    profile = getattr(request.user, "profile", None)

    if profile is None or profile.role != "recruiter":
        return Response(
            {"error": "Only recruiters can view their posted jobs."},
            status=status.HTTP_403_FORBIDDEN
        )

    jobs = Job.objects.filter(
        posted_by=request.user
    ).order_by("-created_at")

    serializer = JobSerializer(jobs, many=True)

    return Response(serializer.data)



@api_view(["PUT", "PATCH", "DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def manage_job(request, pk):
    profile = getattr(request.user, "profile", None)

    if profile is None or profile.role != "recruiter":
        return Response(
            {"error": "Only recruiters can manage jobs."},
            status=status.HTTP_403_FORBIDDEN
        )

    job = get_object_or_404(
        Job,
        pk=pk,
        posted_by=request.user
    )

    if request.method == "DELETE":
        job.delete()
        return Response(
            {"message": "Job deleted successfully."},
            status=status.HTTP_200_OK
        )

    serializer = JobSerializer(
        job,
        data=request.data,
        partial=(request.method == "PATCH")
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recruiter_applications(request):
    profile = getattr(request.user, "profile", None)

    if profile is None or profile.role != "recruiter":
        return Response(
            {"error": "Only recruiters can view applicants."},
            status=status.HTTP_403_FORBIDDEN
        )

    applications = JobApplication.objects.filter(
        job__posted_by=request.user
    ).select_related("job").order_by("-applied_at")

    serializer = JobApplicationSerializer(
        applications,
        many=True
    )

    return Response(serializer.data)


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    profile = getattr(request.user, "profile", None)

    if profile is None or profile.role != "recruiter":
        return Response(
            {"error": "Only recruiters can update application status."},
            status=status.HTTP_403_FORBIDDEN
        )

    application = get_object_or_404(
        JobApplication,
        pk=pk,
        job__posted_by=request.user
    )

    new_status = request.data.get("status")
    allowed_statuses = [
        choice[0]
        for choice in JobApplication._meta.get_field("status").choices
    ]

    if new_status not in allowed_statuses:
        return Response(
            {
                "error": "Invalid status.",
                "allowed_statuses": allowed_statuses
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    application.status = new_status
    application.save(update_fields=["status"])

    serializer = JobApplicationSerializer(application)

    return Response(serializer.data, status=status.HTTP_200_OK)
