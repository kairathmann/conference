# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from chatfuelattributes.models import ChatfuelattributesAnswer
from twitter.models import TwitterStatus
from users.models import SmatchedUser


class ChatfuelattributesAnswerAdmin(admin.ModelAdmin):
    model = ChatfuelattributesAnswer


class SmatchedUserAdmin(admin.ModelAdmin):
    model = SmatchedUser


class TwitterStatusAdmin(admin.ModelAdmin):
    model = TwitterStatus


admin.site.register(ChatfuelattributesAnswer, ChatfuelattributesAnswerAdmin)
admin.site.register(SmatchedUser, SmatchedUserAdmin)
admin.site.register(TwitterStatus, TwitterStatusAdmin)
