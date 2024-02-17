import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import User from "../../../backend/modules/accounts/models/user.model";
import Channel from "./channel.model";

@Table({
	tableName: "user_channels",
	timestamps: true,
	underscored: true,
	modelName: "UserChannel",
})
export default class UserChannel extends Model<UserChannel> {
	@ForeignKey(() => User)
	@Column
	userId: string;

	@ForeignKey(() => Channel)
	@Column
	channelId: string;

	@BelongsTo(() => User, "userId")
	user: User;

	@BelongsTo(() => Channel, "channelId")
	channel: Channel;
}
