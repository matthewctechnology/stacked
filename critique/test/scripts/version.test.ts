/**
 * @jest-environment node
 */
describe('critique version script', () => {
  it('should generate a tag with the correct format', async () => {
    const capability = process.cwd().split('/').pop();
    const version = await import('../../package.json');
    const tag = `${capability}-v${version.version}`;

    expect(version.version.split('.').length).toBe(3);
    expect(tag.startsWith(`${capability}-v`)).toBe(true);
  });
});
