import { Component, OnInit } from '@angular/core';
import { debug } from 'console';
declare const Flashphoner: any;
declare const $: any;
declare const Browser: any;
declare const resizeVideo: any;
declare const field: any;
declare const getUrlParam: any;
declare const createUUID: any;


@Component({
    selector: 'app-hellofromkz',
    templateUrl: './hellofromkz.component.html',
    styleUrls: ['./hellofromkz.component.css']
})
export class HellofromkzComponent implements OnInit {

  constructor() {
  }

  SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;
  ROOM_EVENT = Flashphoner.roomApi.events;
  PRELOADER_URL = './dependencies/media/preloader.mp4';
  connection;
  _participants = 20;
  DIV_IDS = ['participant1Display','participant2Display',
  'participant3Display','participant4Display','participant5Display',
  'participant6Display','participant7Display','participant8Display',
  'participant7Display','participant8Display','participant9Display',
  'participant10Display','participant11Display','participant12Display',
  'participant13Display','participant14Display','participant15Display',
  'participant16Display','participant17Display','participant18Display',
  'participant19Display','participant20Display']

  ngOnInit(): void {
    this.init_page()
  }

  init_page() {
    // init api
    try {
      Flashphoner.init({flashMediaProviderSwfLocation: './media-provider.swf'});
      console.log('flashMediaProviderSwfLocation: ok');
    } catch (e) {
      $('#notifyFlash').text('Your browser doesn\'t support Flash or WebRTC technology needed for this example');
      console.log('flashMediaProviderSwfLocation: error');
      return;
    }
    // $("#url").val(setURL());
    this.onLeft();
  }


  onJoined(room) {
    const _this = this;
    $('#joinBtn').text('Leave').off('click').click(function () {
      $(this).prop('disabled', true);
      room.leave().then(this.onLeft, this.onLeft);
    }).prop('disabled', false);
    $('#sendMessageBtn').off('click').click(function () {
      const message = field('message');
      this.addMessage(this.connection.username(), message);
      $('#message').val('');
      // broadcast message
      const participants = room.getParticipants();
      for (let i = 0; i < participants.length; i++) {
        participants[i].sendMessage(message);
      }
    }).prop('disabled', false);
    $('#failedInfo').text('');
  }

  onLeft() {
    $('[id$=Name]').not(':contains(\'NONE\')').each(function (index, value) {
      $(value).text('NONE');
    });
    const _this = this;
    $('#joinBtn').text('Join').off('click').click(function () {
      if (_this.validateForm()) {
        $(this).prop('disabled', true);
        _this.muteConnectInputs();
        _this.start();
      }
    }).prop('disabled', false);
    $('#sendMessageBtn').prop('disabled', true);
    $('#localStopBtn').prop('disabled', true);
    $('#localAudioToggle').prop('disabled', true);
    $('#localVideoToggle').prop('disabled', true);
    this.unmuteConnectInputs();
  }

  start() {
    const url = /* $('#url').val() */ 'wss://ec2-18-197-65-38.eu-central-1.compute.amazonaws.com:8443';
    const username = $('#login').val();
    if (this.connection && this.connection.status() == this.SESSION_STATUS.ESTABLISHED) {
      // check url and username
      if (this.connection.getServerUrl() != url || this.connection.username() != username) {
        this.connection.on(this.SESSION_STATUS.DISCONNECTED, function () {
        });
        this.connection.on(this.SESSION_STATUS.FAILED, function () {
        });
        this.connection.disconnect();
      } else {
        this.joinRoom();
        return;
      }
    }
    if (Browser.isSafariWebRTC()) {
      const _this = this;
      for (let i = 1; i < this._participants; i++) {
        Flashphoner.playFirstVideo(document.getElementById('participant' + i + 'Display'), false, this.PRELOADER_URL).then(function () {
          _this.createConnection(url, username);
        });
        return;
      }
    }
    this.createConnection(url, username);
  }

  createConnection(url, username) {
    const _this = this;
    this.connection = Flashphoner.roomApi.connect({
      urlServer: url,
      username
    }).on(this.SESSION_STATUS.FAILED, function (session) {
      _this.setStatus('#status', session.status());
      _this.onLeft();
    }).on(this.SESSION_STATUS.DISCONNECTED, function (session) {
      _this.setStatus('#status', session.status());
      _this.onLeft();
    }).on(this.SESSION_STATUS.ESTABLISHED, function (session) {
      _this.setStatus('#status', session.status());
      _this.joinRoom();
    });
  }

  joinRoom() {
    const _this = this;
    this.connection.join({name: this.getRoomName()}).on(this.ROOM_EVENT.STATE, function (room) {
      const participants = room.getParticipants();
      console.log('Current number of participants in the room: ' + participants.length);
      if (participants.length >= _this._participants) {
        console.warn('Current room is full');
        $('#failedInfo').text('Current room is full.');
        room.leave().then(_this.onLeft, _this.onLeft);
        return false;
      }
      _this.setInviteAddress(room.name());
      if (participants.length > 0) {
        let chatState = 'participants: ';
        for (let i = 0; i < participants.length; i++) {
          _this.installParticipant(participants[i]);
          chatState += participants[i].name();
          if (i != participants.length - 1) {
            chatState += ',';
          }
        }
        _this.addMessage('chat', chatState);
      } else {
        _this.addMessage('chat', ' room is empty');
      }
      if (Browser.isSafariWebRTC()) {
        Flashphoner.playFirstVideo(document.getElementById('localDisplay'), true, _this.PRELOADER_URL).then(function () {
          _this.publishLocalMedia(room);
          _this.onJoined(room);
        });
        return;
      }
      _this.publishLocalMedia(room);
      _this.onJoined(room);
    }).on(this.ROOM_EVENT.JOINED, function (participant) {
      _this.installParticipant(participant);
      _this.addMessage(participant.name(), 'joined');
    }).on(this.ROOM_EVENT.LEFT, function (participant) {
      // remove participant
      _this.removeParticipant(participant);
      _this.addMessage(participant.name(), 'left');
    }).on(this.ROOM_EVENT.PUBLISHED, function (participant) {
      _this.playParticipantsStream(participant);
    }).on(this.ROOM_EVENT.FAILED, function (room, info) {
      _this.connection.disconnect();
      $('#failedInfo').text(info);
    }).on(this.ROOM_EVENT.MESSAGE, function (message) {
      _this.addMessage(message.from.name(), message.text);
    });
  }

  addMessage(login, message) {
    const date = new Date();
    const time = date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const newMessage = time + ' ' + login + ' - ' + message.split('\n').join('<br/>') + '<br/>';
    const chat = $('#chat');
    chat.html(chat.html() + newMessage);
    chat.scrollTop(chat.prop('scrollHeight'));
  }

  installParticipant(participant) {
    if (($('[id$=Name]').not(':contains(\'NONE\')').length + 1) == this._participants) {
      console.warn('More than ' + this._participants + ' participants, ignore participant ' + participant.name());
    } else {
      const p = $('[id$=Name]:contains(\'NONE\')')[0].id.replace('Name', '');
      const pName = '#' + p + 'Name';
      $(pName).text(participant.name());
      this.playParticipantsStream(participant);
    }
  }

  removeParticipant(participant) {
    $('[id$=Name]').each(function (index, value) {
      if ($(value).text() == participant.name()) {
        $(value).text('NONE');
      }
    });
  }

  playParticipantsStream(participant) {
    const _this = this;
    if (participant.getStreams().length > 0) {
      $('[id$=Name]').each(function (index, value) {
        if ($(value).text() == participant.name()) {
          const p = value.id.replace('Name', '');
          const pDisplay = p + 'Display';
          participant.getStreams()[0].play(document.getElementById(pDisplay)).on(_this.STREAM_STATUS.PLAYING, function (playingStream) {
            document.getElementById(playingStream.id()).addEventListener('resize', function (event) {
              resizeVideo(event.target);
            });
          });
        }
      });
    }
  }

  getRoomName() {
    const name = getUrlParam('roomName');
    if (name && name !== '') {
      return name;
    }
    return 'room-' + createUUID(6);
  }

  setInviteAddress(name) {
    $('#inviteAddress').text(window.location.href.split('?')[0] + '?roomName=' + name);
  }

  onMediaPublished(stream) {
    $('#localStopBtn').text('Stop').off('click').click(function () {
      $(this).prop('disabled', true);
      stream.stop();
    }).prop('disabled', false);
    $('#localAudioToggle').text('Mute A').off('click').click(function () {
      if (stream.isAudioMuted()) {
        $(this).text('Mute A');
        stream.unmuteAudio();
      } else {
        $(this).text('Unmute A');
        stream.muteAudio();
      }
    }).prop('disabled', false);
    $('#localVideoToggle').text('Mute V').off('click').click(function () {
      if (stream.isVideoMuted()) {
        $(this).text('Mute V');
        stream.unmuteVideo();
      } else {
        $(this).text('Unmute V');
        stream.muteVideo();
      }
    }).prop('disabled', false);
  }

  onMediaStopped(room) {
    const _this = this;
    $('#localStopBtn').text('Publish').off('click').click(function () {
      $(this).prop('disabled', true);
      _this.publishLocalMedia(room);
    }).prop('disabled', (this.connection.getRooms().length == 0));
    $('#localAudioToggle').prop('disabled', true);
    $('#localVideoToggle').prop('disabled', true);
  }

  // publish local video
  publishLocalMedia(room) {
    const _this = this;
    const constraints = {
      audio: true,
      video: true
    };
    const display = document.getElementById('localDisplay');

    room.publish({
      display: display,
      constraints: constraints,
      record: false,
      receiveVideo: false,
      receiveAudio: false
    }).on(this.STREAM_STATUS.FAILED, function (stream) {
      console.warn('Local stream failed!');
      _this.setStatus('#localStatus', stream.status());
      _this.onMediaStopped(room);
    }).on(this.STREAM_STATUS.PUBLISHING, function (stream) {
      _this.setStatus('#localStatus', stream.status());
      _this.onMediaPublished(stream);
    }).on(this.STREAM_STATUS.UNPUBLISHED, function (stream) {
      _this.setStatus('#localStatus', stream.status());
      _this.onMediaStopped(room);
    });
  }

  muteConnectInputs() {
    $(':text').each(function () {
      $(this).prop('disabled', true);
    });
  }

  unmuteConnectInputs() {
    $(':text').each(function () {
      $(this).prop('disabled', false);
    });
  }

  validateForm() {
    let valid = true;
    $(':text').each(function () {
      if (!$(this).val()) {
        highlightInput($(this));
        valid = false;
      } else {
        removeHighlight($(this));
      }
    });
    return valid;

    function highlightInput(input) {
      input.closest('.form-group').addClass('has-error');
    }

    function removeHighlight(input) {
      input.closest('.form-group').removeClass('has-error');
    }
  }

  setStatus(selector, status) {
    const statusField = $(selector);
    statusField.text(status).removeClass();
    if (status == 'PUBLISHING' || status == 'ESTABLISHED') {
      statusField.attr('class', 'text-success');
    } else if (status == 'DISCONNECTED' || status == 'UNPUBLISHED') {
      statusField.attr('class', 'text-muted');
    } else if (status == 'FAILED') {
      statusField.attr('class', 'text-danger');
    }
  }
}
