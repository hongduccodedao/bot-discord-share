const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "Music",
  data: {
    name: "seek",
    aliases: ["sk"],
    description: "Tua bài hát đang phát",
  },

  async execute(client, message, args) {
    const voiceChannel = message.member.voice.channel;
    const queue = await client.distube.getQueue(message);

    if (!voiceChannel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(
              `🚫 | Bạn phải ở trong một kênh thoại để dùng lệnh này!`
            ),
        ],
        ephemeral: true,
      });
    }

    if (queue) {
      if (
        message.guild.members.me.voice.channelId !==
        message.member.voice.channelId
      ) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setDescription(`🚫 | Bạn cần vào cùng kênh thoại với Bot!`),
          ],
          ephemeral: true,
        });
      }
    }

    if (!queue) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Không có bài hát nào đang phát!`),
        ],
        ephemeral: true,
      });
    }

    const time = Number(args[0]);

    if (!time) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bạn phải nhập thời gian để tua!`),
        ],
        ephemeral: true,
      });
    }

    if (time < 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bạn không thể tua ngược thời gian!`),
        ],
        ephemeral: true,
      });
    }

    if (time > queue.songs[0].duration) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(
              `🚫 | Bài hát chỉ có thời lượng **${queue.songs[0].formattedDuration}**!`
            ),
        ],
        ephemeral: true,
      });
    }
    queue.seek(time);
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`✅ | Đã tua **${args[0]}** giây!`),
      ],
      ephemeral: true,
    });
  },
};
