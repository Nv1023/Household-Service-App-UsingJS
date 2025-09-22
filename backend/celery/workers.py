from celery.schedules import crontab
from datetime import datetime, timedelta
from app import celery_app
from backend.celery.tasks import (
    check_and_send_reminders, 
    send_monthly_activity_report
)

celery_app.conf.timezone = 'UTC'
celery_app.conf.enable_utc = True

celery_app.conf.beat_schedule = {
    'daily-reminder-task': {
        'task': 'backend.celery.tasks.check_and_send_reminders',
        'schedule': timedelta(minutes=1), 
        'options': {'queue': 'periodic'},
    },
    'monthly-report-task': {
        'task': 'backend.celery.tasks.send_monthly_activity_report',
        'schedule': timedelta(minutes=2), 
        'options': {'queue': 'periodic'},
    }
}

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        timedelta(minutes=1),
        sender.signature('backend.celery.tasks.check_and_send_reminders'),
        name='periodic-daily-reminder'
    )
    sender.add_periodic_task(
        timedelta(minutes=2),
        sender.signature('backend.celery.tasks.send_monthly_activity_report'),
        name='periodic-monthly-report'
    )

print("Celery Beat Schedule:", celery_app.conf.beat_schedule)