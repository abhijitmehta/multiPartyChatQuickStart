

var timeStamp = (new  Date()).getTime();
var chatClient ;
var channelType ;
var channelName ;
var myChannel ;
var memberName;
var firstTypedLetter='Y';



function getTokenAndSetupChat(memberName,endpointId)
  {
    return new Promise(function(resolve, reject)
    {

      $.get('/token?identity=' + memberName + '&endpointId=' + endpointId, function( data )
               {
                     resolve(data);
                     console.log(data);
                }
          );

    });
  }



function startChat(cobrowserId,sessionKey)
  {
       $('#chatHistory').empty();
      channelType=$('#channelType').val();
      channelName=$('#channelName').val();
      memberName=$('#memberName').val();

      if (channelName === "")
         {
            channelName="General";
         }


     if (memberName === "")
        {
            memberName = "anonymous"+timeStamp;
        }

      endpointId = memberName+':'+timeStamp;

      getTokenAndSetupChat(memberName,endpointId)
      .then(
              function(data)
                    {

                        console.log(data.token)
                        chatClient = new Twilio.Chat.Client(data.token);

	                      chatClient.initialize()
  	                       .then(function(client)
                                {

    	                            console.log("Ready to Chat , will check if channel " +channelName  + " already exists ") ;

                                  client.getChannelByUniqueName(channelName)
                                       .then(function(chosenChannel)
                                                {
                                                  console.log(channelName  + "already exists ") ;
                                                  myChannel=chosenChannel;



                                                  myChannel.join().then(function(channel)
                                                  {
                                                      console.log('Joining channel ' + channel.friendlyName)
                                                      $('#statusMessages').text('Joining channel ' + channel.friendlyName);
                                                      getHistory(channel.friendlyName);
                                                  });

                                                  myChannel.on('messageAdded', function(message)
                                                  {
                                                    if ( message.author != memberName)
                                                    printMessage(message.author, message.body)
                                                  });

                                                  /*chatClient.on("channelJoined", function(channel)
                                                         {
                                                             console.log("We have been joined to a channel, sid: " + channel.sid );
                                                             $('#statusMessages').text('Joined channel ' + channel.friendlyName);
                                                             getHistory(channel.friendlyName);
                                                           })*/

                                                }

                                            )
                                       .catch(function(err)
                                                         {
                                                           console.log("channelType : " + channelType);
                                                           if ( channelType === "1")
                                                              {
                                                                flagIsPrivate = false ;
                                                              }
                                                          else
                                                             {
                                                               flagIsPrivate = true ;
                                                             }

                                                           console.log(channelName  + " does not exists .Will create your channel now ( private = " + flagIsPrivate + ")" ) ;

                                                           client.createChannel({
                                                                      uniqueName: channelName,
                                                                      friendlyName: channelName,
                                                                      isPrivate	: flagIsPrivate
                                                                  }).then(function(createdChannel)
                                                                  {
                                                                      console.log('Created  channel:');
                                                                      $('#statusMessages').text('Created channel ' + createdChannel.friendlyName);
                                                                      console.log(createdChannel);
                                                                      myChannel=createdChannel;
                                                                      myChannel.on('messageAdded', function(message)
                                                                          {
                                                                            if ( message.author != memberName)
                                                                            printMessage(message.author, message.body)
                                                                          });

                                                                          myChannel.join().then(function(channel)
                                                                          {
                                                                              console.log('Joining channel ' + channel.friendlyName)
                                                                              $('#statusMessages').text('Joining channel ' + channel.friendlyName);
                                                                              getHistory(channel.friendlyName);
                                                                          });    

                                                                  });
                                                         }

                                              )


                                  }

  	                              );



                    }
            );


  }







function getHistory()
{

   myChannel.getMessages(5)
            .then(function(latestPage)
                    {
                      console.log(latestPage)
                      for (i=0;i<5;i++)
                       {
                            printMessage(latestPage.items[i].author , latestPage.items[i].body) ;

                       }
                    }
                  );

}

function sendMessage(body)
{

  myChannel.sendMessage(body);
  console.log("Message Sent");
  $('#statusMessages').text("Sent");
  firstTypedLetter='Y';
  printMessage(memberName,body)


}


function printMessage(auth,msg)
{
     console.log("Message by " + auth+ "received")

     chatHistoryDiv=$('#chatHistory') ;

    if (auth === memberName )
      {
        //$('#chatHistory').append( "<div ><span class='left'>"+auth+":"+msg+"</span></div><hr>" );
        chatHistoryDiv.append(
        "<div class='chat-message bubble-left' >"+
          "<div class='avatar'>"+
               "<img src='img/minionBob.png' alt='' width='32' height='32'>"+
          "</div>"+
          "<div class='chat-message-content'>" +
            "<h5>"+msg+"</h5>"+
            //"<span class='chat-time right'>13:35</span>"+
            //"<p class='right'>Me</p>"+
          "</div> <!-- end chat-message-content -->"+
          //"<hr>"+
        "</div> <!-- end chat-message -->"
      );



      }
    else
    {
      //$('#chatHistory').append( "<div ><span class='right'>"+auth+":"+msg+"</span></div><hr>" );
      chatHistoryDiv.append(
      "<div class='chat-message bubble-right'>"+
        "<img src='img/minionKevin.png' alt='' width='32' height='32'>"+
        "<div class='chat-message-content'>" +
          //"<span class='chat-time'>13:35</span>"+
          "<p font-size='50%' font-style= 'italic'>"+auth+"</p>"+
          "<h5>"+msg+"</h5>"+
        "</div> <!-- end chat-message-content -->"+
        //"<hr>"+
      "</div> <!-- end chat-message -->"
       );
    }
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);

}






$('#chatInput').on('keydown', function(e)
{
  if(firstTypedLetter==='Y')
  {
     $('#statusMessages').text("Typing....");

  }
  firstTypedLetter='N';
  if (e.keyCode === 13)
     {
        var msg = $('#chatInput').val();
        if (msg != '' )
         {
          sendMessage(msg);
          $('#chatInput').val('');

         }

     }
  else if (myChannel) { myChannel.typing(); }
}
);


function showChatWindow()
  {
    $('#chatWindow').show();

  }


  function showSignInWindow()
  {
    $('#signInWindow').show();

  }


  function hideChatWindow()
  {
    $('#chatWindow').hide();

  }


  function hideSignInWindow()
  {
    $('#signInWindow').hide();

  }
