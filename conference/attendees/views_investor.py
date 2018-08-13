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


class MyInvestor(APIView):

    @transaction.atomic
    def get(self, request, format=None):
        if not models.ConferenceUser.objects.filter(user=self.request.user).exists():
            models.ConferenceUser.objects.create(user=self.request.user)

        # Check if the current user even has an investor
        if not request.user.conference_user.investor:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        return JsonResponse(serializers.InvestorSerializer(request.user.conference_user.investor).data,
                            status=status.HTTP_200_OK)

    @transaction.atomic
    def put(self, request, format=None):
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
        clean_nationality = nationality[:models.COUNTRY_MAX_LENGTH] if nationality else ''

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
