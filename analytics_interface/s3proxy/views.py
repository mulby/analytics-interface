import os

from boto.s3.connection import S3Connection
from django.conf import settings
from django.http import HttpResponse, Http404


def proxy(request, filename):
    if hasattr(settings, 'S3_PROXY_LOCAL_OVERRIDE'):
        local_path = settings.S3_PROXY_LOCAL_OVERRIDE
        with open(os.path.join(local_path, filename), 'r') as input_file:
            return HttpResponse(input_file.read())

    s3 = S3Connection()
    bucket = s3.get_bucket(settings.S3_PROXY_BUCKET, validate=False)
    key = bucket.get_key(filename)
    if key is None:
        raise Http404

    response = HttpResponse(key.get_contents_as_string())
    response['Content-Type'] = key.content_type
    response['Content-Encoding'] = key.content_encoding
    response['Content-Disposition'] = key.content_disposition
    response['Content-Language'] = key.content_language

    return response