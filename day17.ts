
const logSignal = (listener: string) => (signal: string) => console.log(`${listener}: ${signal}`);

(async () => {

  // process.on('SIGINT', logSignal('SIGINT'))
  process.on('SIGTSTP', logSignal('SIGTSTP'))
  process.on('SIGTERM', logSignal('SIGTERM'))
  process.on('SIGABRT', logSignal('SIGABRT'))
  process.on('SIGQUIT', logSignal('SIGQUIT'))
  process.on('beforeExit', logSignal('beforeExit'))
  process.on('exit', logSignal('exit'))

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

})()
