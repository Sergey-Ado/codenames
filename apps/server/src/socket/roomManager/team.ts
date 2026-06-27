import { RoomRoleType } from '@repo/shared/room';

export class Team {
  private spymasterId: string = '';
  private operativeIds: string[] = [];
  private maxCount: number;

  public constructor(maxCount: number) {
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

  public removeSpymasterId(): void {
    this.spymasterId = '';
  }

  public removeOperativeId(userId: string): void {
    this.operativeIds = this.operativeIds.filter(id => id !== userId);
  }

  public canUpdate(userId: string, role: RoomRoleType): boolean {
    if (role === 'spymaster' && this.spymasterId !== '') return false;

    if (
      role === 'operative' &&
      (this.operativeIds.includes(userId) ||
        this.operativeIds.length >= this.maxCount - 1)
    )
      return false;

    return true;
  }

  public isStaffed(): boolean {
    return (
      this.getSpymasterId() !== '' &&
      this.getOperativeIds().length >= this.maxCount - 1
    );
  }
}
