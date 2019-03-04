import { Method } from './method';

// TODO: use two classes for parsing of json and for use by application
export class Subsystem {
    memberClass: string;
    subsystemCode: string;
    xRoadInstance: string;
    subsystemStatus: string;
    memberCode: string;
    fullSubsystemName: string;
    methods: Method[];
}
