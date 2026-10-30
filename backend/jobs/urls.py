
from django.urls import path
from .views import (
    job_list,
    apply_job,
    my_applications,
    create_job,
    my_posted_jobs,
    manage_job,
)
from .views import recruiter_applications
from .views import update_application_status

urlpatterns = [
    path("", job_list, name="job_list"),
    path("apply/", apply_job, name="apply_job"),
    path("applications/", my_applications, name="my_applications"),
    path("create/", create_job, name="create_job"),
    path("my-posted-jobs/", my_posted_jobs, name="my_posted_jobs"),
    path("<int:pk>/manage/", manage_job, name="manage_job"),
    path(
    "recruiter-applications/",
    recruiter_applications,
    name="recruiter_applications"
),
    path(
    "applications/<int:pk>/status/",
    update_application_status,
    name="update_application_status"
),
    ]
