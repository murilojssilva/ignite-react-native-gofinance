import React, { useCallback, useEffect, useState } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  Container,
  Header,
  UserInfo,
  UserWrapper,
  Photo,
  User,
  UserGreeting,
  UserName,
  HighlightCards,
  Icon,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from "./styles";
import { useTheme } from "styled-components";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );
  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const lastTransactions = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );
    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinance:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensiveSum = 0;

    const transactionsFormatted = transactions.map((item: DataListProps) => {
      item.type === "positive"
        ? (entriesSum += Number(item.amount))
        : (expensiveSum += Number(item.amount));
      let amount = Number(item.amount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      amount = amount.replace("R$", "R$ ");

      const date = Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    const lastTransactionEntries = getLastTransactionDate(
      transactionsFormatted,
      "positive"
    );
    const lastTransactionExpensives = getLastTransactionDate(
      transactionsFormatted,
      "negative"
    );
    const totalInterval = `01 a ${lastTransactionExpensives}`;

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: (entriesSum - expensiveSum).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setData(transactionsFormatted);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "https://github.com/murilojssilva.png" }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Murilo</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount={highlightData?.entries?.amount}
          lastTransaction={highlightData?.entries?.lastTransaction}
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount={highlightData?.expensives?.amount}
          lastTransaction={highlightData?.expensives?.lastTransaction}
        />
        <HighlightCard
          type="total"
          title="Total"
          amount={highlightData?.total?.amount}
          lastTransaction={highlightData?.total?.lastTransaction}
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
