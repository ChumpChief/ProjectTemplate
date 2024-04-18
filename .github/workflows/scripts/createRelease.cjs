module.exports = async ({github, context, core, exec}, { releaseNotes }, { tagName }) => {
    console.log("Getting latest release...");
    let isLatest = true;
    try {
        const { data: latestRelease } = await github.rest.repos.getLatestRelease({
            owner: context.repo.owner,
            repo: context.repo.repo,
        });
        const latestReleaseTag = latestRelease.tag_name;
        const latestReleaseVersionParsed = latestReleaseTag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
        const latestReleaseVersionInfo = {
            major: latestReleaseVersionParsed[1],
            minor: latestReleaseVersionParsed[2],
            patch: latestReleaseVersionParsed[3],
        };
        const newReleaseVersionParsed = tagName.match(/^v(\d+)\.(\d+)\.(\d+)$/);
        const newReleaseVersionInfo = {
            major: newReleaseVersionParsed[1],
            minor: newReleaseVersionParsed[2],
            patch: newReleaseVersionParsed[3],
        };
        isLatest = newReleaseVersionInfo.major > latestReleaseVersionInfo.major
            || newReleaseVersionInfo.major === latestReleaseVersionInfo.major && newReleaseVersionInfo.minor > latestReleaseVersionInfo.minor
            || newReleaseVersionInfo.major === latestReleaseVersionInfo.major && newReleaseVersionInfo.minor === latestReleaseVersionInfo.minor && newReleaseVersionInfo.patch > latestReleaseVersionInfo.patch;
    } catch (error) {
        // Unfortunately, getLatestRelease gives a 404 error when no releases exist, so we'll just suppress that.
        // TODO: See if there's a way to distinguish normal 404 errors from the no releases case.
        if (error.status !== 404) {
            throw error;
        }
        console.log("Attempt to get latest relase 404'd, assuming this is the latest release...");
    }

    console.log(`Creating a release at tag: ${ tagName }, latest: ${ isLatest }...`);
    await github.rest.repos.createRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: tagName,
        name: tagName,
        body: releaseNotes,
        make_latest: isLatest.toString(),
    });
};
