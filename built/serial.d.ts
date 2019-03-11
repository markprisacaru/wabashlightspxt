/// <reference types="node" />
import * as commandParser from './commandparser';
export declare function isInstalled(): boolean;
export interface SerialPortInfo {
    comName: string;
    pnpId: string;
    manufacturer: string;
    vendorId: string;
    productId: string;
    opened?: boolean;
    port?: any;
}
export declare function monitorSerial(onData: (info: SerialPortInfo, buffer: Buffer) => void): void;
export declare function flashSerialAsync(c: commandParser.ParsedCommand): Promise<void>;
