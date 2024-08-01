# AuditGroups Apps Script Application
## Overview

The AuditGroups project provides an Apps Script Application to audit and manage Google Workspace groups, which can be run everyday for continious audit. The script checks for potential security vulnerabilities related to group membership and visibility settings and optionally remediates them. It also sends alerts to a Slack channel if configured.

Insecure Google Workspace Groups can lead to exposed sensitive data in emails, as well as GCP or SaaS application privilege escalation. More info on this vulnerability:
- [DEF CON 29 - Matthew Bryant - Hacking G Suite: The Power of Dark Apps Script Magic](https://www.youtube.com/watch?v=6AsVUS79gLw)
- [Hacktricks article](https://cloud.hacktricks.xyz/pentesting-cloud/gcp-security/gcp-to-workspace-pivoting#google-groups-privilege-escalation)

## Features

    Group Audit: Identifies groups with insecure membership and visibility settings.
    Auto-remediation: Optionally fixes insecure settings.
    Slack Notifications: Sends alerts to a Slack channel when issues are found.

## Configuration

Before running the script, configure the following constants:

    AUTOREMEDIATE_JOIN (boolean): Set to true to automatically remediate groups that allow all domain users to join.
    AUTOREMEDIATE_VIEW (boolean): Set to true to automatically remediate groups that are visible to all domain users or the public.
    SLACK_ALERTING (boolean): Set to true to enable Slack notifications.
    SLACK_WEBHOOK (string): The webhook URL for your Slack channel.
    DOMAIN (string): The domain name of your Google Workspace.

## Installation
### Step 1: Create a New Google Apps Script Project

    Go to Google Apps Script.
    Click on "New project".

### Step 2: Add the Script

    Copy and paste the script into the code editor.

### Step 3: Enable APIs

    Click on the Services icon (the + symbol in the left toolbar) in the Apps Script editor.
    Add the following Google services:
        Admin Directory API
        Admin Groups Settings API

### Step 4 [Optional]: Configure Triggers

    Click on the clock icon in the left toolbar to open the Triggers page.
    Click on + Add Trigger.
    Set the function to AuditGroups.
    Choose "Time-driven" for the event source.
    Select "Day timer" and choose the time you want the script to run daily.
    The function will then run daily, with an Oauth token linked to your account.

## Usage

    Set Configuration: Update the constants AUTOREMEDIATE_JOIN, AUTOREMEDIATE_VIEW, SLACK_ALERTING, SLACK_WEBHOOK, and DOMAIN with your desired settings.
    Run the Script: You can manually execute the AuditGroups function or let it run automatically based on the trigger you set up.

## Dependencies

    Google Apps Script
    Admin SDK for Google Workspace