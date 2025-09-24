import * as schema from '../schema';

export default class Relations {
  /**
     * Constructor
     * @param {Config} config - config object
     * @param {Object} rels - relations map
     */
  constructor (config, rels) {
    this.config = config;
    this.rels = {
      Clients: {},
      Users: {},
      ChatMessages: {},
      Files: {},
      RatingPolls: {},
      Ratings: {},
      InfoRequests: {}
    };

    if (rels.Clients) {
      rels.Clients.forEach(client => {
        this.rels.Clients[client.ID] = client;
      });
    }

    if (rels.Users) {
      this.users(rels.Users).forEach(user => {
        this.rels.Users[user.ID] = user;
      });
    }

    if (rels.Files) {
      this.files(rels.Files).forEach(file => {
        this.rels.Files[file.ID] = file;
      });
    }

    if (rels.RatingPolls) {
      this.ratingPolls(rels.RatingPolls).forEach(poll => {
        this.rels.RatingPolls[poll.ID] = poll;
      });
    }

    if (rels.Ratings) {
      this.ratings(rels.Ratings).forEach(rating => {
        this.rels.Ratings[rating.ID] = rating;
      });
    }
    if (rels.InfoRequests) {
      this.infoRequests(rels.InfoRequests).forEach(request => {
        this.rels.InfoRequests[request.ID] = request;
      });
    }

    if (rels.ChatMessages) {
      this.messages(rels.ChatMessages).forEach(message => {
        this.rels.ChatMessages[message.ID] = message;
      });
    }
  }

  users (users) {
    return users.map(u => this.user(u));
  }

  user (user) {
    if (user.AvatarID) {
      user.AvatarURL = this.config.imageUrl(user.AvatarID, schema.ImageSizeAvatar);
    }
    return user;
  }

  messages (messages) {
    return messages.map(m => this.message(m));
  }

  message (message) {
    if (message.ClientID) {
      message.Client = this.rels.Clients[message.ClientID];
    }
    if (message.UserID) {
      message.User = this.rels.Users[message.UserID];
    }
    if (message.FileID) {
      message.File = this.rels.Files[message.FileID];
    }
    if (message.RatingID) {
      message.Rating = this.rels.Ratings[message.RatingID];
    }

    if (message.InfoRequestID) {
      const infoReq = this.rels.InfoRequests[message.InfoRequestID];
      if (infoReq && infoReq.State === 'pending') {
        message.InfoRequest = infoReq;
      };
    }

    message.CreatedAt = new Date(message.CreatedAt);
    return message;
  }

  files (files) {
    return files.map(m => this.file(m));
  }

  file (file) {
    file.URL = this.config.fileUrl(file.ID);
    if (file.Type === schema.FileTypeImage) {
      file.ThumbnailURL = this.config.imageUrl(file.ID, schema.ImageSizeThumbnail);
      file.PreviewURL = this.config.imageUrl(file.ID, schema.ImageSizePreview);
    }
    return file;
  }

  events (events) {
    return events.map(e => this.event(e));
  }

  event (event) {
    if (event.ClientID) {
      event.Client = this.rels.Clients[event.ClientID];
    }
    if (event.UserID) {
      event.User = this.rels.Users[event.UserID];
    }
    if (event.MessageID) {
      event.Message = this.rels.ChatMessages[event.MessageID];
    }
    return event;
  }

  ratings (ratings) {
    return ratings.map(r => this.rating(r));
  }

  rating (rating) {
    if (rating.RatingPollID) {
      rating.RatingPoll = this.rels.RatingPolls[rating.RatingPollID];
    }
    return rating;
  }

  ratingPolls (polls) {
    return polls.map(r => this.poll(r));
  }

  poll (poll) {
    return poll;
  }

  infoRequests (requests) {
    return requests.map(r => this.infoRequest(r));
  }

  infoRequest (request) {
    return request;
  }
}
