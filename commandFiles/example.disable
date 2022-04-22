const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("Command Name")
        .setDescription("Sentence saying what the command does")
        // can make multiple commands
        .addSubcommand((subcommand) =>
            subcommand.setName("Command Name 2")
            .setDescription("Still a sentence saying what the command does")
            // Adds an option to read the argument with the command
            .addStringOption((option) => option.setName("argument after command").setRequired(true))
    )
}