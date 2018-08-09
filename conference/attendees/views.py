# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import generics
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models
from . import serializers
import json


class CreateUpdatePerson(APIView):

    @transaction.atomic
    def post(self, request, format=None):
        json_body = request.data

        if models.ConferenceUser.objects.filter(user=request.user).exists():
            conference_user = models.ConferenceUser.objects.get(user=request.user)
        else:
            conference_user = models.ConferenceUser()
            conference_user.user = request.user

        first_name = json_body.get('first_name')
        clean_first_name = first_name[:models.ConferenceUser.FIRST_NAME_MAX_LENGTH] if first_name is not None else ''

        last_name = json_body.get('last_name')
        clean_last_name = last_name[:models.ConferenceUser.LAST_NAME_MAX_LENGTH] if last_name is not None else ''

        request.user.first_name = clean_first_name
        request.user.last_name = clean_last_name
        request.user.save()

        title = json_body.get('title')
        clean_title = title[:models.ConferenceUser.TITLE_MAX_LENGTH] if title else ''

        company = json_body.get('company')
        clean_company = company[:models.ConferenceUser.TITLE_MAX_LENGTH] if company else ''

        twitter = json_body.get('twitter')
        clean_twitter = twitter[:models.ConferenceUser.TWITTER_MAX_LENGTH] if twitter else ''

        facebook = json_body.get('facebook')
        clean_facebook = facebook[:models.ConferenceUser.FACEBOOK_MAX_LENGTH] if facebook else ''

        telegram = json_body.get('telegram')
        clean_telegram = telegram[:models.ConferenceUser.TELEGRAM_MAX_LENGTH] if telegram else ''

        linkedin = json_body.get('linkedin')
        clean_linkedin = linkedin[:models.ConferenceUser.LINKEDIN_MAX_LENGTH] if linkedin else ''

        conference_user.title = clean_title
        conference_user.company = clean_company
        conference_user.twitter = clean_twitter
        conference_user.facebook = clean_facebook
        conference_user.telegram = clean_telegram
        conference_user.linkedin = clean_linkedin

        conference_user.save()
        return Response(serializers.ConferenceUserSerializer(conference_user).data, status=status.HTTP_201_CREATED)


class CreateUpdateInvestor(APIView):

    @transaction.atomic
    def post(self, request, format=None):
        json_body = request.data

        if not models.ConferenceUser.objects.filter(user=self.request.user).exists():
            models.ConferenceUser.objects.create(user=self.request.user)
        if request.user.conference_user.investor:
            investor = request.user.conference_user.investor
        else:
            investor = models.Investor.objects.create()

        funding_stages = json_body.get('funding_stages')
        clean_funding_stages = [models.FundingStage.objects.get(pk=pk) for pk in funding_stages] if (
            funding_stages
        ) else models.FundingStage.objects.all()

        giveaways = json_body.get('giveaways')
        clean_giveaways = [models.Giveaway.objects.get(pk=pk) for pk in giveaways] if (
            giveaways
        ) else [models.Giveaway.objects.get(pk=pk) for pk in [1, 2]]

        industries = json_body.get('industries')
        clean_industries = [models.Industry.objects.get(pk=pk) for pk in industries] if (
            industries
        ) else models.Industry.objects.all()

        nationality = json_body.get('nationality')
        clean_nationality = nationality[:2] if nationality else ''

        product_stages = json_body.get('product_stages')
        clean_product_stages = [models.ProductStage.objects.get(pk=pk) for pk in product_stages] if (
            product_stages
        ) else models.ProductStage.objects.all()

        region = json_body.get('region')
        clean_region = models.Region.objects.get(pk=region) if (
            region and 1 <= region <= 4
        ) else models.Region.objects.get(pk=models.Region.ANYWHERE)

        region_other_text = json_body.get('region_other_text')
        clean_region_other_text = region_other_text[:models.Investor.REGION_OTHER_TEXT_MAX_LENGTH] if (
            region_other_text and clean_region.pk == models.Region.OTHER
        ) else ''

        ticket_sizes = json_body.get('ticket_sizes')
        clean_ticket_sizes = [models.TicketSize.objects.get(pk=pk) for pk in ticket_sizes] if (
            ticket_sizes
        ) else models.TicketSize.objects.all()

        token_types = json_body.get('token_types')
        clean_token_types = [models.TokenType.objects.get(pk=pk) for pk in token_types] if (
            token_types
        ) else models.TokenType.objects.all()

        investor.funding_stages = clean_funding_stages
        investor.giveaways = clean_giveaways
        investor.industries = clean_industries
        investor.nationality = clean_nationality
        investor.product_stages = clean_product_stages
        investor.region = clean_region
        investor.region_other_text = clean_region_other_text
        investor.ticket_sizes = clean_ticket_sizes
        investor.token_types = clean_token_types

        investor.save()
        request.user.conference_user.investor = investor
        request.user.conference_user.save()
        return JsonResponse(serializers.InvestorSerializer(investor).data, status=status.HTTP_201_CREATED)


class CreateUpdateProject(APIView):

    @transaction.atomic
    def post(self, request, format=None):
        json_body = request.data

        if not models.ConferenceUser.objects.filter(user=self.request.user).exists():
            models.ConferenceUser.objects.create(user=self.request.user)
        if request.user.conference_user.project:
            project = request.user.conference_user.project
        else:
            project = models.Project()

        description = json_body.get('description')
        clean_description = description[:models.Project.DESCRIPTION_MAX_LENGTH] if description else ''

        funding_stage = json_body.get('funding_stage')
        clean_funding_stage = models.FundingStage.objects.get(pk=funding_stage) if (
                funding_stage and 1 <= funding_stage <= 3
        ) else None

        fundraising_amount = json_body.get('fundraising_amount')
        clean_fundraising_amount = fundraising_amount if fundraising_amount and fundraising_amount >= 0 else 0

        github = json_body.get('github')
        clean_github = github[:models.Project.GITHUB_MAX_LENGTH] if github else ''

        giveaway = json_body.get('giveaway')
        clean_giveaway = models.Giveaway.objects.get(pk=giveaway) if (
                giveaway and 1 <= giveaway <= 3
        ) else None

        industry = json_body.get('industry')
        clean_industry = models.Industry.objects.get(pk=industry) if (
                industry and 1 <= industry <= 41
        ) else models.Industry.objects.get(pk=41)

        legal_country = json_body.get('legal_country')
        clean_legal_country = legal_country[:2] if legal_country else ''

        main_country = json_body.get('main_country')
        clean_main_country = main_country[:2] if main_country else ''

        name = json_body.get('name')
        clean_name = name[:models.Project.NAME_MAX_LENGTH] if name else '-'

        news = json_body.get('news')
        try:
            clean_news = news[:200] if news else ''
        except:
            clean_news = ''

        notable = json_body.get('notable')
        clean_notable = notable[:models.Project.NOTABLE_MAX_LENGTH] if notable else ''

        product_stage = json_body.get('product_stage')
        clean_product_stage = models.ProductStage.objects.get(pk=product_stage) if (
            product_stage and 1 <= product_stage <= 3
        ) else None

        size = json_body.get('size')
        clean_size = size if size and size >= 0 else 0

        tagline = json_body.get('tagline')
        clean_tagline = tagline[:models.Project.TAGLINE_MAX_LENGTH] if tagline else ''

        telegram = json_body.get('telegram')
        clean_telegram = telegram[:models.Project.TELEGRAM_MAX_LENGTH] if telegram else ''

        token_type = json_body.get('token_type')
        clean_token_type = models.TokenType.objects.get(pk=token_type) if (
            token_type and 1 <= token_type <= 3
        ) else None

        twitter = json_body.get('twitter')
        clean_twitter = twitter[:models.Project.TWITTER_MAX_LENGTH] if twitter else ''

        website = json_body.get('website')
        try:
            clean_website = website[:200] if website else ''
        except:
            clean_website = ''

        whitepaper = json_body.get('whitepaper')
        try:
            clean_whitepaper = whitepaper[:200] if whitepaper else ''
        except:
            clean_whitepaper = ''

        project.description = clean_description
        project.funding_stage = clean_funding_stage
        project.fundraising_amount = clean_fundraising_amount
        project.github = clean_github
        project.giveaway = clean_giveaway
        project.industry = clean_industry
        project.legal_country = clean_legal_country
        project.main_country = clean_main_country
        project.name = clean_name
        project.news = clean_news
        project.notable = clean_notable
        project.product_stage = clean_product_stage
        project.size = clean_size
        project.tagline = clean_tagline
        project.telegram = clean_telegram
        project.token_type = clean_token_type
        project.twitter = clean_twitter
        project.website = clean_website
        project.whitepaper = clean_whitepaper

        project.save()
        request.user.conference_user.project = project
        request.user.conference_user.save()
        return JsonResponse(serializers.ProjectSerializer(project).data, status=status.HTTP_201_CREATED)


class ListInvestor(generics.ListAPIView):
    queryset = models.Investor.objects.all()
    serializer_class = serializers.InvestorSerializer

    def get_queryset(self):
        filters = {}
        excludes = {}
        funding_stages = self.request.GET.getlist('funding_stage')
        if funding_stages:
            filters['funding_stages__in'] = funding_stages
        giveaways = self.request.GET.getlist('giveaway')
        if giveaways:
            filters['giveaways__in'] = giveaways
        product_stages = self.request.GET.getlist('product_stage')
        if product_stages:
            filters['product_stages__in'] = product_stages
        region = self.request.GET.get('region')
        if region == models.Region.ANYWHERE_EXCEPT_UNITED_STATES:
            excludes['nationality'] = models.Region.COUNTRY_UNITED_STATES
        elif region == models.Region.SOUTH_KOREA_ONLY:
            filters['nationality'] = models.Region.COUNTRY_SOUTH_KOREA
        token_types = self.request.GET.getlist('token_type')
        if token_types:
            filters['token_types__in'] = token_types
        return models.Investor.objects.filter(**filters).exclude(**excludes)


class CreateJob(generics.CreateAPIView):
    queryset = models.JobListing.objects.all()
    serializer_class = serializers.JobListingSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        if not models.ConferenceUser.objects.filter(user=self.request.user).exists():
            raise ValidationError('Person missing.')
        if not self.request.user.conference_user.project:
            raise ValidationError('Project missing.')
        serializer.save(project=self.request.user.conference_user.project)


class ListProject(generics.ListAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer

    def get_queryset(self):
        filters = {}
        excludes = {}
        funding_stages = self.request.GET.getlist('funding_stage')
        if funding_stages:
            filters['funding_stage__in'] = funding_stages
        giveaways = self.request.GET.getlist('giveaway')
        if giveaways:
            # Projects with giveaway BOTH are always found.
            giveaways.append(models.Giveaway.BOTH)
            filters['giveaway__in'] = giveaways
        product_stages = self.request.GET.getlist('product_stage')
        if product_stages:
            filters['product_stage__in'] = product_stages
        region = self.request.GET.get('region')
        if region == models.Region.ANYWHERE_EXCEPT_UNITED_STATES:
            excludes['legal_country'] = models.Region.COUNTRY_UNITED_STATES
            excludes['main_country'] = models.Region.COUNTRY_UNITED_STATES
        token_types = self.request.GET.getlist('token_type')
        if token_types:
            filters['token_types__in'] = token_types
        return models.Project.objects.filter(**filters).exclude(**excludes)


class ListCreateUser(APIView):
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def post(self, request, format=None):
        json_body = request.data
        email = json_body.get('email')
        password = json_body.get('password')

        # email None or ''
        if not email:
            return Response('email_missing', status=status.HTTP_400_BAD_REQUEST)

        # password None or ''
        if not password:
            return Response('password_missing', status=status.HTTP_400_BAD_REQUEST)

        clean_email = email.lower()

        if models.User.objects.filter(email=clean_email).exists():
            return Response('email_exists', status=status.HTTP_409_CONFLICT)

        if models.User.objects.filter(username=clean_email).exists():
            return Response('username_exists', status=status.HTTP_409_CONFLICT)

        user = models.User.objects.create(
            email=clean_email,
            first_name='',
            last_name='',
            password=make_password(password),
            username=clean_email,
        )
        serializer = serializers.UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RetrieveUpdateDestroyInvestor(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Investor.objects.all()
    serializer_class = serializers.InvestorSerializer


class RetrieveUpdateDestroyProject(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer


def users_id(request, pk):
    if request.method == 'GET':
        user = get_object_or_404(models.User, id=pk)
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }, status=200)
    return HttpResponse(status=405)
