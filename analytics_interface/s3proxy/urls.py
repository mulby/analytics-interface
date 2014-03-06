from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^(?P<filename>[\w\.\-_]+)$', 's3proxy.views.proxy'),
)