import { Card, Typography } from "antd";
import { useState } from "react";
import PollCardChoices from "./PollCardChoices";
import PollCardFooter from "./PollCardFooter";
import VoteModal from "./PollVoteModal";

interface Poll {
  id: number;
  title: string;
  description: string;
  expired: boolean;
  expiry_date: string;
  total_vote_count: number;
  choices_with_vote_percentage: {
    id: number;
    choice_text: string;
    vote_count: number;
    vote_percentage: number;
  }[];
}

interface Props {
  poll: Poll;
}

const PollCard = ({ poll }: Props) => {
  const {
    id,
    title,
    description,
    expired,
    expiry_date,
    choices_with_vote_percentage,
  } = poll;
  const [modalVisible, setModalVisible] = useState(false);
  const [, setSelectedChoiceId] = useState(null);
  const handleVoteButtonClick = () => {
    setModalVisible(true);
  };

  return (
    <Card
      title={title}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
      }}
      bordered
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontWeight: "normal",
      }}
      extra={
        expired ? (
          <span style={{ color: "red" }}>Expired</span>
        ) : (
          <span>{`${new Date(expiry_date).getDay()}-${new Date(
            expiry_date
          ).getMonth()}-${new Date(expiry_date).getFullYear()} at ${new Date(
            expiry_date
          ).getUTCHours()}:${new Date(expiry_date).getMinutes()} UTC`}</span>
        )
      }
    >
      <Typography>{description}</Typography>
      {poll.expired && (
        <PollCardChoices
          choices_with_vote_percentage={choices_with_vote_percentage}
          expired={expired}
          onChoiceSelect={setSelectedChoiceId}
        />
      )}
      <VoteModal
        choices_with_vote_percentage={choices_with_vote_percentage}
        description={description}
        expired={expired}
        visible={modalVisible}
        setModalVisible={setModalVisible}
        pollId={id}
        onChoiceSelect={setSelectedChoiceId}
      />
      <PollCardFooter onVoteButtonClick={handleVoteButtonClick} poll={poll} />
    </Card>
  );
};

export default PollCard;
