import { Inject, Injectable, Logger } from '@nestjs/common';
import { configService } from '../../config/config.service';
import { Web3Constants } from '../../web3/util/constants';
import { ContractsNames, ContractsObjects } from '../util/constants';
import { AbiJson, AbisConfig } from '../../config/model/config.data';
import { Contract, ethers, providers } from 'ethers';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private contracts = new Map<string, Contract>();

  constructor(
    @Inject(Web3Constants.CLIENT)
    private readonly provider: providers.Provider,
    @Inject(ContractsObjects.ABIS) private readonly abis: AbisConfig,
  ) {
    this.instantiateContracts();
  }

  getMarketplaceContract(): ethers.Contract {
    return this.getContract(ContractsNames.MARKET_FACET);
  }

  getMarketplaceV2Contract(): ethers.Contract {
    return this.getContract(ContractsNames.MARKET_FACET_V2);
  }

  getWethContract(): ethers.Contract {
    return this.cacheAndGetContract(
      configService.getContractsConfig().wethAddress,
      this.abis.erc20Abi,
    );
  }

  getMetaTransactionContract(contractAddress: string): ethers.Contract {
    return this.cacheAndGetContract(
      contractAddress,
      this.abis.nativeMetaTransactionAbi,
    );
  }

  getNftContract(contractAddress: string): ethers.Contract {
    return this.cacheAndGetContract(contractAddress, this.abis.prjContractAbi);
  }

  getErc20Contract(contractAddress: string): ethers.Contract {
    return this.cacheAndGetContract(contractAddress, this.abis.erc20Abi);
  }

  private cacheAndGetContract(
    contractAddress: string,
    contractAbi: AbiJson,
  ): ethers.Contract {
    if (!this.contracts[contractAddress]) {
      this.instantiateContract(contractAbi, contractAddress, true);
    }
    return this.contracts[contractAddress];
  }

  private getContract(contractName: string): ethers.Contract {
    if (!this.contracts[contractName])
      throw new Error(
        `There is no contract instantiated named ${contractName}`,
      );

    return this.contracts[contractName];
  }

  private instantiateContracts() {
    const contractsAddresses = configService.getContractsConfig();
    this.instantiateContract(
      this.abis.marketplaceContractAbi,
      contractsAddresses.diamondAddress,
      false,
    );
    this.instantiateContract(
      this.abis.marketplaceV2ContractAbi,
      contractsAddresses.diamondAddress,
      false,
    );
    this.instantiateContract(
      this.abis.nativeMetaTransactionAbi,
      contractsAddresses.diamondAddress,
      false,
    );
  }

  private instantiateContract(
    contractAbi: AbiJson,
    contractAddress: string,
    cacheByAddress: boolean,
  ) {
    this.logger.log(
      `Instantiating ${contractAbi.contractName} at address ${contractAddress}`,
    );

    this.contracts[
      cacheByAddress ? contractAddress : contractAbi.contractName
    ] = new ethers.Contract(contractAddress, contractAbi.abi, this.provider);
  }
}
