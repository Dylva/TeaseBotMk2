const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies back pong"),

    run: async({client, interaction}) => {
        return interaction.editReply("Pong!");
    }
}