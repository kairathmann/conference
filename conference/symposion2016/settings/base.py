import os


PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
PACKAGE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
BASE_DIR = PACKAGE_ROOT

DEBUG = True
TEMPLATE_DEBUG = DEBUG
EMAIL_DEBUG = DEBUG


DATABASES = {
    'default': {
        'ENGINE': os.environ.get('CONFERENCE_DB_ENGINE'),
        'NAME': os.environ.get('CONFERENCE_DB_NAME'),
        'USER': os.environ.get('CONFERENCE_DB_USER'),
        'PASSWORD': os.environ.get('CONFERENCE_DB_PASSWORD'),
        'HOST': os.environ.get('CONFERENCE_DB_HOST'),
        'PORT': os.environ.get('CONFERENCE_DB_PORT'),
    }
}

ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = "UTC"

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = "en-us"

SITE_ID = int(os.environ.get("SITE_ID", 1))

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(PACKAGE_ROOT, "site_media", "media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = "/site_media/media/"

# Absolute path to the directory static files should be collected to.
# Don"t put anything in this directory yourself; store your static files
# in apps" "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(PACKAGE_ROOT, "site_media", "static")

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = "/site_media/static/"

# Additional locations of static files
STATICFILES_DIRS = [
    os.path.join(PACKAGE_ROOT, "static"),
]

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# Make this unique, and don't share it with anybody.
SECRET_KEY = "+v73%rd75lo_w%g$95n#bvftdi6^g!*lzwuxto=u+hu&mf8n(t"

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = [
    "django.template.loaders.filesystem.Loader",
    "django.template.loaders.app_directories.Loader",
]

TEMPLATE_CONTEXT_PROCESSORS = [
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.core.context_processors.request",
    "django.contrib.messages.context_processors.messages",
    "account.context_processors.account",
    "pinax_theme_bootstrap.context_processors.theme",
    "symposion.reviews.context_processors.reviews",
]


MIDDLEWARE_CLASSES = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.auth.middleware.SessionAuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    # "django.middleware.transaction.TransactionMiddleware",  -- Deprecated in 1.6 (https://docs.djangoproject.com/en/dev/topics/db/transactions/#transaction-middleware)
    "reversion.middleware.RevisionMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "symposion2016.urls"

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = "symposion2016.wsgi.application"

TEMPLATE_DIRS = [
    os.path.join(PACKAGE_ROOT, "templates"),
]

MESSAGE_STORAGE = "django.contrib.messages.storage.session.SessionStorage"

INSTALLED_APPS = [
    # "django.contrib.sites",
    "django.contrib.auth",
    "django.contrib.admin",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "django.contrib.humanize",

    # api
    "rest_framework",
    "rest_framework.authtoken",

    # theme
    "bootstrapform",
    "pinax_theme_bootstrap",

    # external
    "account",
    "anymail",
    "easy_thumbnails",
    "eventlog",
    "markitup",
    "metron",
    "reversion",
    "sitetree",
    "taggit",
    "timezones",
    "django_bleach",

    # symposion
    "symposion",
    "pinax",
    "pinax.boxes",
    # "symposion.cms",
    "symposion.conference",
    "symposion.proposals",
    "symposion.reviews",
    "symposion.schedule",
    "symposion.speakers",
    "symposion.sponsorship",
    "symposion.teams",

    # project
    "symposion2016",
    "symposion2016.pycon_proposals",
    "symposion2016.conf_api",

    # luna
    "attendees",
    "smatched",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'attendees.authentication.BearerTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/opt/python/log/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}

FIXTURE_DIRS = [
    os.path.join(PROJECT_ROOT, "fixtures"),
]

EMAIL_BACKEND = "anymail.backends.sendgrid.EmailBackend"
DEFAULT_FROM_EMAIL = 'Block Seoul Team <noreply@meetluna.com>'

ACCOUNT_OPEN_SIGNUP = True
ACCOUNT_EMAIL_UNIQUE = True
ACCOUNT_EMAIL_CONFIRMATION_REQUIRED = True
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = 'speaker_create'
ACCOUNT_LOGIN_REDIRECT_URL = "dashboard"
ACCOUNT_SIGNUP_REDIRECT_URL = "dashboard"
ACCOUNT_LOGOUT_REDIRECT_URL = "home"
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 2
ACCOUNT_USER_DISPLAY = lambda user: user.email

THEME_CONTACT_EMAIL = 'cfp@pycon.ca'

AUTHENTICATION_BACKENDS = [
    # Permissions Backends
    "symposion.teams.backends.TeamPermissionsBackend",

    # Auth backends
    "account.auth_backends.EmailAuthenticationBackend",
    
    # Allow admin login without email 
    'django.contrib.auth.backends.ModelBackend',
]


MARKITUP_SET = "markitup/sets/markdown"
MARKITUP_FILTER = ["symposion.markdown_parser.parse", {}]
MARKITUP_SKIN = "markitup/skins/simple"
PINAX_BOXES_HOOKSET = 'symposion2016.parsers.MarkdownHookSet'

CONFERENCE_ID = 1
SYMPOSION_PAGE_REGEX = r"(([\w-]{1,})(/[\w-]{1,})*)/"
PROPOSAL_FORMS = {
    "tutorial": "symposion2016.pycon_proposals.forms.TutorialProposalForm",
    "talk": "symposion2016.pycon_proposals.forms.TalkProposalForm",
}

ANYMAIL = {
    "SENDGRID_API_KEY": os.environ.get('SENDGRID_API_SEND_KEY'),
}

# Image upload
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = os.environ.get('CONFERENCE_AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('CONFERENCE_AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('CONFERENCE_AWS_STORAGE_BUCKET_NAME')
AWS_DEFAULT_ACL = 'private'
AWS_S3_ENCRYPTION = True
AWS_QUERYSTRING_EXPIRE = 60*60*24*30

IMAGE_URL_BASE = os.environ.get('CONFERENCE_IMAGE_URL_BASE', 'https://blockseoul-test.imgix.net/')
