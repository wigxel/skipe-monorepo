import Channel from "../models/channel.model";
import UserChannel from "../models/user-channel.model";
import {
	TCreateChannelAttributes,
	TCreateUserChannelAttributes,
} from "../types/channel.types";

export const CreateChannelQuery = async (
	createChannelDto: TCreateChannelAttributes,
): Promise<Channel> => Channel.create(createChannelDto as Channel);

export const JoinChannelQuery = async (
	createUserChannelDto: TCreateUserChannelAttributes,
): Promise<UserChannel> =>
	UserChannel.create(createUserChannelDto as UserChannel);
