export type TCreateChannelAttributes = {
	id: string;
	name: string;
};

export type TCreateUserChannelAttributes = {
	id: string;
	channelId: string;
	userId: string;
};
