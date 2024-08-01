function AuditGroups() {
  const AUTOREMEDIATE_JOIN = false;
  const AUTOREMEDIATE_VIEW = false;
  const SLACK_ALERTING = true;
  const SLACK_WEBHOOK = '';
  const DOMAIN = '';

  var groups = listAllGroups(DOMAIN);
  var message = "";
  for (var i = 0; i < groups.length; i++) {
    var group = AdminGroupsSettings.Groups.get(groups[i])
    if(group.whoCanJoin == "ALL_IN_DOMAIN_CAN_JOIN"){
      var remediated = AUTOREMEDIATE_JOIN ? "_Yes_" : "_No_";
      message += "*Email:* "+group.email+" - *All users in the domain can join the group !* - Remediated?:"+ remediated+"\n";
      if(AUTOREMEDIATE_JOIN){
        remediateJoin(group)
      }
    }
    if(group.whoCanViewGroup == "ALL_IN_DOMAIN_CAN_VIEW" || group.whoCanViewGroup == "ANYONE_CAN_VIEW"){
      var remediated = AUTOREMEDIATE_VIEW ? "_Yes_" : "_No_";
      var vulnerability = (group.whoCanViewGroup == "ALL_IN_DOMAIN_CAN_VIEW") ? "*All users in the domain can view the group messages !*" : "*All users, even externals, can view the group messages !*"
      message += "*Email:* "+group.email+" - "+vulnerability+" - Remediated:"+remediated+"\n";
      if(AUTOREMEDIATE_VIEW){
        remediateView(group)
      }
    }
  }
  if(SLACK_ALERTING && message !== ""){
    postToSlack(SLACK_WEBHOOK,message)
  }else{
    console.log(message)
  }
}

function remediateJoin(group){
  group.whoCanJoin = "INVITED_CAN_JOIN"
  AdminGroupsSettings.Groups.patch(group,group.email)
}

function remediateView(group){
  group.whoCanViewGroup = "ALL_MEMBERS_CAN_VIEW"
  AdminGroupsSettings.Groups.patch(group,group.email)
}

function postToSlack(webhookUrl,message) {
  var payload = {
    blocks: [
      {
        text: {
          text: `New Workspace config alert\n`,
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text: message,
          type: 'mrkdwn',
        },
        type: 'section',
      },
    ],
  };
 
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
 
  return UrlFetchApp.fetch(webhookUrl, options)
}

function listAllGroups(domain) {
  var grouprows= [];
  var pageToken;
    
  var page;
  do { page = AdminDirectory.Groups.list({ domain: domain, maxResults: 100, pageToken: pageToken});
    var groups = page.groups;
    if (groups){ for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var grouprow = group.email;
        grouprows.push(grouprow)
        }
    } 
    pageToken = page.nextPageToken;
  } while (pageToken);
    
    return grouprows
}