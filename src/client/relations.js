import * as schema from '../schema';

export default class Relations {
    /**
     * Constructor
     * @param {Config} config - config object
     * @param {Object} rels - relations map
     */
    constructor(config, rels) {
        this.config = config;
        this.rels = {
            Clients: {},
            Users: {},
            ChatMessages: {},
            Files: {},
            Ratings: {}
        };

        if (rels.Clients) {
            rels.Clients.forEach(client => {
                this.rels.Clients[client.Id] = client;
            });
        }

        if (rels.Users) {
            this.users(rels.Users).forEach(user => {
                this.rels.Users[user.Id] = user;
            });
        }
        
        if (rels.Files) {
            this.files(rels.Files).forEach(file => {
                this.rels.Files[file.Id] = file;
            });
        }

        if (rels.Ratings) {
            this.ratings(rels.Ratings).forEach(rating => {
                this.rels.Ratings[rating.Id] = rating;
            });
        }
        
        if (rels.ChatMessages) {
            this.messages(rels.ChatMessages).forEach(message => {
                this.rels.ChatMessages[message.Id] = message;
            });
        }
    }

    users(users) {
        return users.map(u => this.user(u));
    }

    user(user) {
        if (user.AvatarId) {
            user.AvatarURL = this.config.imageUrl(user.AvatarId, schema.ImageSizeAvatar);
        }
        return user;
    }

    messages(messages) {
        return messages.map(m => this.message(m));
    }

    message(message) {
        if (message.ClientId) {
            message.Client = this.rels.Clients[message.ClientId];
        }
        if (message.UserId) {
            message.User = this.rels.Users[message.UserId];
        }
        if (message.FileId) {
            message.File = this.rels.Files[message.FileId];
        }
        if (message.RatingId) {
            message.Rating = this.rels.Ratings[message.RatingId];
        }

        message.CreatedAt = new Date(message.CreatedAt);
        return message;
    }

    files(files) {
        return files.map(m => this.file(m));
    }

    file(file) {
        file.URL = this.config.fileUrl(file.Id);
        if (file.Type === schema.FileTypeImage) {
            file.ThumbnailURL = this.config.imageUrl(file.Id, schema.ImageSizeThumbnail);
            file.PreviewURL = this.config.imageUrl(file.Id, schema.ImageSizePreview);
        }
        return file;
    }

    events(events) {
        return events.map(e => this.event(e));
    }

    event(event) {
        if (event.ClientId) {
            event.Client = this.rels.Clients[event.ClientId];
        }
        if (event.UserId) {
            event.User = this.rels.Users[event.UserId];
        }
        if (event.MessageId) {
            event.Message = this.rels.ChatMessages[event.MessageId];
        }
        return event;
    }

    ratings(ratings) {
        return ratings.map(r => this.rating(r));
    }

    rating(rating) {
        return rating;
    }
}
