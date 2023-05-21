const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  category: "Owner",
  data: {
    name: "eval",
    aliases: ["e"],
    description: "Thục thi code",
  },

  async execute(client, message, args) {
    if (message.author.id !== client.config.owner) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setAuthor({
              name: "Lỗi",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription("Bạn không có quyền thực thi lệnh này!"),
        ],
        ephemeral: true,
      });
    }

    const code = args.join(" ");

    try {
      const evaled = await eval(code);
      const cannot = ["token", "password", "secret", "key", "api"];

      if (cannot.some((word) => code.includes(word))) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setAuthor({
                name: "Lỗi",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription("Không thể thực thi lệnh này!"),
          ],
          ephemeral: true,
        });
      }

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorDefault)
            .setAuthor({
              name: "Thành công",
              iconURL: client.user.displayAvatarURL(),
            })
            .addFields([
              {
                name: "Code",
                value: `\`\`\`js\n${code}\n\`\`\``,
              },
              {
                name: "Kết quả",
                value: `\`\`\`js\n${inspect(evaled, {
                  depth: 0,
                })}\n\`\`\``,
              },
              {
                name: "Kiểu dữ liệu",
                value: `\`\`\`js\n${typeof evaled}\n\`\`\``,
              },
              {
                name: "Thời gian thực thi",
                value: `\`\`\`js\n${
                  Date.now() - message.createdTimestamp
                }ms\n\`\`\``,
              },
            ]),
        ],
      });
    } catch (error) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setAuthor({
              name: "Lỗi",
              iconURL: client.user.displayAvatarURL(),
            })
            .addFields([
              {
                name: "Code",
                value: `\`\`\`js\n${code}\n\`\`\``,
              },
              {
                name: "Lỗi",
                value: `\`\`\`js\n${error}\n\`\`\``,
              },
            ]),
        ],
      });
    }
  },
};
