import type { Journey } from '../data/journeys';
import type { TravelEvent, TravelReceipt } from '../data/travelEvents';
import type { DungeonRun } from '../data/access';
import type { EquippedItem } from '../data/equipment';
import type { Battle } from '../data/battle';
import type { Guild } from '../data/city';
import type { ChatMessage } from '../components/WorldChat';
import type { QuestProgress } from '../data/questSchedule';
export type Stat='Strength'|'Intelligence'|'Discipline'|'Vitality'; type Effect={name:string;kind:'buff'|'debuff';turns:number;power:number}; export type Hero={journey?:Journey|null;visitedAreas?:string[];pendingTravelEvent?:TravelEvent|null;travelHistory?:TravelReceipt[];classRulesVersion?:number;classChoicePending?:boolean;creationComplete?:boolean;clearedAreas?:string[];defeatedEnemies?:Record<string,string[]>;dungeonEntries?:Record<string,number>;raidEntries?:Record<string,number>;dungeonRun?:DungeonRun|null;name:string;className:string;level:number;xp:number;gold:number;hp:number;stats:Record<Stat,number>;preparedConsumables?:string[];inventory:string[];equipped:string[];equipment?:EquippedItem[];equipmentSerial?:number;completed:string[];questProgress?:QuestProgress;effects:Effect[];face?:string;hair?:string;beard?:string;hairColor?:string;restUntil?:number;energy?:number;energyUpdatedAt?:number;energyResting?:boolean;lodgingUpdatedAt?:number;rewardChest?:string[];battle?:Battle|null;purchases?:Record<string,boolean>;ownedMounts?:string[];mount?:string|null;guild?:Guild|null;chatMessages?:ChatMessage[]};
