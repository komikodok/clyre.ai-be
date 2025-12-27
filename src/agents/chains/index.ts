import { anxietyChain } from "./anxiety.chain";
import { burnoutChain } from "./burnout.chain";
import { generalChain } from "./general.chain";
import { insomniaChain } from "./insomnia.chain";


export const chains = {
    general: generalChain,
    burnout: burnoutChain,
    anxiety: anxietyChain,
    insomnia: insomniaChain
}