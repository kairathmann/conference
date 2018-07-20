# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-18 10:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChatfuelattributesAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('messenger_user_id', models.BigIntegerField(db_index=True)),
                ('survey', models.CharField(db_index=True, max_length=255)),
                ('answer_number', models.PositiveSmallIntegerField(db_index=True)),
                ('answer_text', models.TextField(blank=True)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='chatfuelattributesanswer',
            unique_together=set([('messenger_user_id', 'survey', 'answer_number')]),
        ),
    ]