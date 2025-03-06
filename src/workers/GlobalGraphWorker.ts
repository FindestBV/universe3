class GlobalGraphWorker {
  private static instance: Worker | null = null;
  private static referenceCount = 0;
  private static callbacks: { [key: string]: (data: any) => void } = {};

  private constructor() {}

  public static getWorker(): Worker {
    if (!this.instance) {
      const graphWorkerURL = new URL("/graphWorker.js", import.meta.url);
      this.instance = new Worker(graphWorkerURL);
      this.instance.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === "graphData" && this.callbacks[data.graphId]) {
          this.callbacks[data.graphId](data);
        }
      };
    }
    this.referenceCount++;
    return this.instance;
  }

  public static registerCallback(graphId: string, callback: (data: any) => void): void {
    this.callbacks[graphId] = callback;
  }

  public static deregisterCallback(graphId: string): void {
    delete this.callbacks[graphId];
    this.referenceCount--;
    if (this.referenceCount === 0) {
      this.terminateInstance();
    }
  }

  public static terminateInstance(): void {
    if (this.instance) {
      this.instance.terminate();
      this.instance = null;
      this.callbacks = {};
    }
  }
}

export default GlobalGraphWorker;
