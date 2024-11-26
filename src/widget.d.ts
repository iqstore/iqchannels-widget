declare class IQChannelsWidget extends EventEmitter {
    constructor(options: {
        url?: string;
        channel: string;
        credentials?: string;
        mode?: 'web' | 'mobile';
        project?: string;
        width?: number;
        padBody?: boolean;
        requireName?: boolean;
        iconOptions?: IconOptions; // deprecated
        DOMIdentifier?: string;
        chats?: Chat[];
        enableImgModals?: boolean; // deprecated
        imgModalOptions?: ImgModalOptions;
    });

    open(text?: string): void;
    close(): void;
    destroy(): void;
    toggle(): void;
    logout(): void;
    refreshClient(): void;
    setIPhonePushToken(token: string): void;
    setAndroidPushToken(token: string): void;
    replyMessage(msg: ChatMessage): void;
    scrollToMessage(msg: number): void;
    sendRatingData(rating: Rating): void;

    on(event: 'open', listener: () => void): void;
    on(event: 'close', listener: () => void): void;
    on(event: 'message', listener: () => void): void;
    on(event: 'file-clicked', listener: (data: string) => void): void;
    on(event: 'unread', listener: (data: number) => void): void;
    on(event: 'longtap', listener: (data: ChatMessage) => void): void;
    on(event: 'rating', listener: (data: Rating) => void): void;
    on(event: 'error', listener: (error: WidgetError) => void): void;
    on(event: 'ready', listener: () => void): void;
}

interface WidgetError {
    type: WidgetErrorType,
    data?: any,
    retryAttempt?: number,
}

interface ImgModalOptions {
    enabled: boolean;
    state: ImgModalState;
}

type ImgModalState = 'mobile' | 'web';

type WidgetErrorType = "connetion"

interface Rating {
    Id: number;
    ProjectId: number;
    TicketId: number;
    ClientId: number;

    State: RatingState;
    Value: number;
    Comment: string;

    CreatedAt: Timestamp;
    UpdatedAt: Timestamp;
}

type RatingState = "pending" | "ignored" | "rated";

interface ChatMessage {
    Id: number;
    ReplyToMessageId?: number;
    ChatId: number;
    LocalId?: number;
    EventId: number;
    TicketMessageId: number;
    TicketId: number;
    MailingMessageId?: number;
    ProductId?: number;
    ProductOfferState?: number;

    Author: ActorType;
    ClientId: number;
    UserId: number;

    Text: string;
    RatingId?: string;
    BotpressPayload?: string;
    FileId?: string;
    FileURL?: string;

    Received?: boolean;
    Read?: boolean;
    Listened?: boolean;
    Pushed?: boolean;
    IsDropDown?: boolean;
    Deleted?: boolean;


    CreatedAt?: Timestamp;
    ReceivedAt?: Timestamp;
    ReadAt?: Timestamp;
    ListenedAt?: Timestamp;
    DeletedAt?: Timestamp;
}

type Timestamp = number;  // UTC in millis

type ActorType = "client" | "user" | "system";

interface IconOptions {
    show?: boolean;
    backgroundColor?: string;
    color?: string;
    style?: { [key: string]: string };
}

interface Chat {
    channel: string;
    credentials?: string;
}

declare namespace EventEmitter {
    type EventListener = (...args: any[]) => void;
    type EmitterMethod = (type: string, listener: EventListener) => void;

    interface Emitter {
        emit(type: string, ...args: any[]): void;
        off: EmitterMethod;
        on: EmitterMethod;
        once: EmitterMethod;
    }
}

function EventEmitter(obj?: any): EventEmitter.Emitter;

declare namespace window {
    export let IQChannelsWidget: IQChannelsWidget;
}
