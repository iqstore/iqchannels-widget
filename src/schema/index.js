export const FileTypeFile = 'file';
export const FileTypeImage = 'image';

export const ImageSizeAvatar = 'avatar';
export const ImageSizeThumbnail = 'preview';
export const ImageSizePreview = 'preview';

export const ChatPayloadText = 'text';
export const ChatPayloadFile = 'file';
export const ChatPayloadNotice = 'notice';
export const ChatPayloadRating = 'rating';

export const ChatEventMessageCreated = 'message_created';
export const ChatEventMessageReceived = 'message_received';
export const ChatEventMessageRead = 'message_read';
export const ChatEventMessageListened = 'message_listened';
export const ChatEventMessageEdited = 'message_edited';
export const ChatEventChatClosed = 'chat_closed';
export const ChatEventMessagesDeleted = 'delete-messages';
export const ChatEventCloseSystemChat = 'close-system-chat';
export const ChatEventTyping = 'typing';
export const ChatEventFileUpdated = 'file_updated';
export const ChatEventClientChanged = 'client_changed';
export const ChatEventRatingIgnored = 'rating_ignored';

export const LOCALSTORAGE_CHANNEL_NAME = 'iq-channel-name';
export const LOCALSTORAGE_WIDGET_CONFIG = 'iq-widget-config';
export const LOCALSTORAGE_WIDGET_0_CONFIG = 'iq-widget-0-config';
export const DefaultThirdClientConfig = {
  chats: [
    {
      channel: 'support',
      credentials: '3'
    },
    {
      channel: 'finance',
      credentials: '3'
    }
  ]
};
export const DefaultAnonClientConfig = {
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',

  requireName: true,

width: 280,
padBody: false,
iconOptions: {
  show: false,
},
DOMIdentifier: 'ion-nav',
mode: 'mobile',
imgModalOptions: {
  enabled: true,
  state: 'mobile'
},
onLinkClick: (type, value) => {

    if (!value) {
        return;
      }
      switch (type) {
        case 'URL':
          window.open(value, '_system');
          break;
        case 'EMAIL':
          window.location.href = 'email';
          break;
        case 'PHONE':
          window.location.href = 'phone';
          break;
      }
    }
}
