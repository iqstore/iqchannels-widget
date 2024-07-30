export function isYoungerVersion(version1, version2) {
	if (version1.includes(version2) || version2.includes(version1)) {
		return true
	}
	const parseVersion = (version) => {
		const [main, preRelease] = version.split('-');
		const mainParts = main.split('.').map(Number);
		return { mainParts, preRelease: preRelease || '' };
	};

	const v1 = parseVersion(version1);
	const v2 = parseVersion(version2);

	for (let i = 0; i < 3; i++) {
		if (v1.mainParts[i] > v2.mainParts[i]) return false;
		if (v1.mainParts[i] < v2.mainParts[i]) return true;
	}

	if (!v1.preRelease && v2.preRelease) return true;
	if (v1.preRelease && !v2.preRelease) return false;

	if (v1.preRelease > v2.preRelease) return true;
	if (v1.preRelease < v2.preRelease) return false;

	return false;
}
