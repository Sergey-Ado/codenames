export class Team {
  private spymasterId: string = '';
  private operativeIds: string[] = [];
  private maxCount: number = 0;

  public constructor(maxCount: number = 0) {
    this.maxCount = maxCount;
  }

  public addSpymasterId(id: string): boolean {
    if (this.spymasterId) return false;

    this.spymasterId = id;
    return true;
  }

  public addOperativeId(id: string): boolean {
    if (this.operativeIds.length >= this.maxCount - 1) return false;

    this.operativeIds.push(id);
    return true;
  }

  public getSpymasterId(): string {
    return this.spymasterId;
  }

  public getOperativeIds(): string[] {
    return this.operativeIds;
  }
}
