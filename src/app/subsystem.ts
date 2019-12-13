import { Method } from './method';
import { Service } from './service';

export class Subsystem {
    memberClass: string;
    subsystemCode: string;
    xRoadInstance: string;
    subsystemStatus: string;
    servicesStatus: string;
    memberCode: string;
    fullSubsystemName: string;
    methods: Method[];
    services: Service[];
}
