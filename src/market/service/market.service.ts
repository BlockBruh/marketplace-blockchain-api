import { Injectable, Logger } from '@nestjs/common';
import { ContractService } from '../../wallet/service/contract.service';
import {
  BuyFiatDTO,
  BuyFiatDTOV2,
  BuyListedFiat,
  BuyListedFiatV2,
  BuyNewFiat,
} from '../dto/inbound.interface';
import { WalletService } from '../../wallet/service/wallet.service';
import { TransactionIdResponse } from '../../nft/dto/outbound.interface';
import { BigNumber, ethers, PopulatedTransaction } from 'ethers';
import { MissingDataException } from '../../util/exception/missingData.exception';
import { Web3Service } from '../../web3/service/web3.service';
import { configService } from '../../config/config.service';
import { UserDataResponseDTO } from '../dto/outbound.interface';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    private readonly contractService: ContractService,
    private readonly walletService: WalletService,
    private readonly web3Service: Web3Service,
  ) {}

  async getBalance(
    tokenAddress: string,
    correlationId: string,
  ): Promise<BigNumber> {
    this.logger.log(
      `Getting marketplace balance for token with address ${tokenAddress}`,
      correlationId,
    );
    if (tokenAddress == ethers.constants.AddressZero) {
      return this.web3Service.getBalance(
        this.contractService.getMarketplaceContract().address,
      );
    } else {
      const erc20Contract = this.contractService.getErc20Contract(tokenAddress);
      return await erc20Contract.balanceOf(
        this.contractService.getMarketplaceContract().address,
      );
    }
  }

  async getAllowanceForUsers(
    users: string[],
    correlationId: string,
  ): Promise<UserDataResponseDTO[]> {
    this.logger.log(
      `Getting marketplace WETH allowance and balance for users: ${users}`,
      correlationId,
    );
    const wethContract = this.contractService.getWethContract();
    const userDataResponseDtos: UserDataResponseDTO[] = [];
    const calls: Promise<string>[] = [];
    for (const user of users) {
      calls.push(
        wethContract
          .allowance(user, configService.getContractsConfig().diamondAddress)
          .then(async (allowanceResponse: any) => {
            const balanceResponse = await wethContract.balanceOf(user);
            userDataResponseDtos.push(
              new UserDataResponseDTO({
                user_address: user,
                allowance: allowanceResponse.toString(),
                balance: balanceResponse.toString(),
              }),
            );
          }),
      );
    }
    await Promise.all(calls);

    return userDataResponseDtos;
  }

  async buyFiat(
    buyFiatDto: BuyFiatDTO,
    correlationId: string,
  ): Promise<TransactionIdResponse> {
    if (!buyFiatDto.new && !buyFiatDto.listed) {
      throw new MissingDataException(
        `must have at least one of buyFiatDto.new or buyFiatDto.listed!`,
      );
    } else if (buyFiatDto.new && !buyFiatDto.listed) {
      return this.buyNewFiat(
        correlationId,
        buyFiatDto.buyerAddress,
        buyFiatDto.externalId,
        buyFiatDto.new,
      );
    } else if (!buyFiatDto.new && buyFiatDto.listed) {
      return this.buyListedFiat(
        correlationId,
        buyFiatDto.buyerAddress,
        buyFiatDto.externalId,
        buyFiatDto.listed,
      );
    } else {
      this.logger.log(
        `Buy combined NFTs for ${buyFiatDto.buyerAddress}`,
        correlationId,
      );
      const marketplaceContract = this.contractService.getMarketplaceContract();
      const buyFiatFunction: PopulatedTransaction = await this.walletService
        .connectContract(marketplaceContract)
        .populateTransaction.buyFiat(
          buyFiatDto.buyerAddress,
          buyFiatDto.externalId,
          buyFiatDto.new.mintsSignature,
          buyFiatDto.new.mints,
          buyFiatDto.listed,
        );
      const transactionHash = await this.walletService.sendTransaction(
        correlationId,
        buyFiatFunction,
        marketplaceContract.interface,
      );
      return {
        transaction_id: transactionHash,
      };
    }
  }

  async buyFiatV2(
    buyFiatDto: BuyFiatDTOV2,
    correlationId: string,
  ): Promise<TransactionIdResponse> {
    if (!buyFiatDto.new && !buyFiatDto.listed) {
      throw new MissingDataException(
        `must have at least one of buyFiatDto.new or buyFiatDto.listed!`,
      );
    } else if (buyFiatDto.new && !buyFiatDto.listed) {
      return this.buyNewFiatV2(
        correlationId,
        buyFiatDto.buyerAddress,
        buyFiatDto.externalId,
        buyFiatDto.new,
      );
    } else if (!buyFiatDto.new && buyFiatDto.listed) {
      return this.buyListedFiatV2(
        correlationId,
        buyFiatDto.buyerAddress,
        buyFiatDto.externalId,
        buyFiatDto.listed,
      );
    } else {
      this.logger.log(
        `Buy combined NFTs for ${buyFiatDto.buyerAddress}`,
        correlationId,
      );
      const marketplaceContract =
        this.contractService.getMarketplaceV2Contract();
      const buyFiatV2Function: PopulatedTransaction = await this.walletService
        .connectContract(marketplaceContract)
        .populateTransaction.buyFiatV2(
          buyFiatDto.buyerAddress,
          buyFiatDto.externalId,
          buyFiatDto.new.mintsSignature,
          buyFiatDto.new.mints,
          buyFiatDto.listed,
        );
      const transactionHash = await this.walletService.sendTransaction(
        correlationId,
        buyFiatV2Function,
        marketplaceContract.interface,
      );
      return {
        transaction_id: transactionHash,
      };
    }
  }

  private async buyNewFiat(
    correlationId: string,
    buyerAddress: string,
    externalId: BigNumber,
    buyNewFiatDto: BuyNewFiat,
  ): Promise<TransactionIdResponse> {
    this.logger.log(`Buy new NFTs for ${buyerAddress}`, correlationId);
    const marketplaceContract = this.contractService.getMarketplaceContract();
    const buyNewFiatFunction: PopulatedTransaction = await this.walletService
      .connectContract(marketplaceContract)
      .populateTransaction.buyNewFiat(
        buyerAddress,
        externalId,
        buyNewFiatDto.mintsSignature,
        buyNewFiatDto.mints,
      );
    const transactionHash = await this.walletService.sendTransaction(
      correlationId,
      buyNewFiatFunction,
      marketplaceContract.interface,
    );
    return {
      transaction_id: transactionHash,
    };
  }

  private async buyNewFiatV2(
    correlationId: string,
    buyerAddress: string,
    externalId: BigNumber,
    buyNewFiatDto: BuyNewFiat,
  ): Promise<TransactionIdResponse> {
    this.logger.log(`Buy new NFTs for ${buyerAddress}`, correlationId);
    const marketplaceContract = this.contractService.getMarketplaceV2Contract();
    const buyNewFiatFunction: PopulatedTransaction = await this.walletService
      .connectContract(marketplaceContract)
      .populateTransaction.buyNewFiatV2(
        buyerAddress,
        externalId,
        buyNewFiatDto.mintsSignature,
        buyNewFiatDto.mints,
      );
    const transactionHash = await this.walletService.sendTransaction(
      correlationId,
      buyNewFiatFunction,
      marketplaceContract.interface,
    );
    return {
      transaction_id: transactionHash,
    };
  }

  private async buyListedFiat(
    correlationId: string,
    buyerAddress: string,
    externalId: BigNumber,
    buyListedFiatDto: BuyListedFiat,
  ): Promise<TransactionIdResponse> {
    this.logger.log(`Buy listed NFTs for ${buyerAddress}`, correlationId);
    const marketplaceContract = this.contractService.getMarketplaceContract();
    const buyListedFiatFunction = await this.walletService
      .connectContract(marketplaceContract)
      .populateTransaction.buyListedFiat(
        buyerAddress,
        externalId,
        buyListedFiatDto,
      );
    const transactionHash = await this.walletService.sendTransaction(
      correlationId,
      buyListedFiatFunction,
      marketplaceContract.interface,
    );
    return {
      transaction_id: transactionHash,
    };
  }

  private async buyListedFiatV2(
    correlationId: string,
    buyerAddress: string,
    externalId: BigNumber,
    buyListedFiatDto: BuyListedFiatV2,
  ): Promise<TransactionIdResponse> {
    this.logger.log(`Buy listed NFTs for ${buyerAddress}`, correlationId);
    const marketplaceContract = this.contractService.getMarketplaceV2Contract();
    const buyListedFiatFunction = await this.walletService
      .connectContract(marketplaceContract)
      .populateTransaction.buyListedFiatV2(
        buyerAddress,
        externalId,
        buyListedFiatDto,
      );
    const transactionHash = await this.walletService.sendTransaction(
      correlationId,
      buyListedFiatFunction,
      marketplaceContract.interface,
    );
    return {
      transaction_id: transactionHash,
    };
  }
}
