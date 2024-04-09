module.exports = async ({github, context, core, exec}, { releaseNotes }, { tagName }) => {
    console.log(`Creating a release at tag: ${ tagName }...`);
    await github.rest.repos.createRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: tagName,
        name: tagName,
        body: releaseNotes,
    });
};
