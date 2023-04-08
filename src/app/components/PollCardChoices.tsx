import { Progress, Radio, Space } from "antd";
import React from "react";
import { Poll } from "../../types/poll";

interface PollCardChoicesProps {
  choices_with_vote_percentage: Poll["choices_with_vote_percentage"];
  expired: boolean;
  onChoiceSelect: React.Dispatch<React.SetStateAction<null>>;
}

const PollCardChoices: React.FC<PollCardChoicesProps> = ({
  choices_with_vote_percentage,
  expired,
  onChoiceSelect,
}) => {
  return (
    <>
      <Radio.Group
        disabled={expired}
        onChange={(e) => onChoiceSelect(e.target.value)}
        style={{ margin: "5%" }}
      >
        <Space direction="vertical">
          {choices_with_vote_percentage.map((choice) => (
            <Radio key={choice.id} value={choice.id}>
              {choice.choice_text}
              {expired && (
                <Progress
                  percent={Number(choice.vote_percentage.toFixed(2))}
                  strokeColor="#159895"
                  strokeWidth={10}
                />
              )}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

export default PollCardChoices;
