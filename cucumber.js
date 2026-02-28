export default {
  import: ['tests/steps/**/*.ts', 'tests/support/**/*.ts'],
  format: [
    'summary',
    'html:reports/report.html',
    'json:reports/report.json',
  ],
  formatOptions: { snippetInterface: 'async-await' },
};
