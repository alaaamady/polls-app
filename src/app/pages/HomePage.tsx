import { useState, useEffect } from "react";
import { Layout, Input, Typography, Spin, Pagination, Col, Row } from "antd";
import axios from "axios";
import PollCard from "../components/PollCard";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

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
const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalPolls, setTotalPolls] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(process.env);
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${apiUrl}/polls/?page=${currentPage}`)
      .then((response) => {
        setPolls(response.data.results);
        setTotalPolls(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleSearch = () => {
    setLoading(true);

    axios
      .get(`${apiUrl}/polls/?search=${searchTerm}`)
      .then((response) => {
        setPolls(response.data.results);
        setTotalPolls(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <Layout className="layout">
      <Header style={{ backgroundColor: "#149c94" }}>
        <Title level={1} style={{ color: "white", marginTop: 7 }}>
          Votify
        </Title>
      </Header>

      <Content>
        <Title level={1} style={{ textAlign: "center", fontWeight: "normal" }}>
          Cast your vote and make your voice heard 📢
        </Title>

        <div style={{ textAlign: "center" }}>
          <Search
            placeholder="Search polls..."
            bordered
            style={{
              borderRadius: "20px",
              borderColor: "#149c94",
              width: "70%",
              border: "5px",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            onSearch={handleSearch}
          />
        </div>
        <div style={{ margin: 20 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {polls.map((poll) => (
                <Col span={12} key={poll.id}>
                  <PollCard poll={poll} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
      <div style={{ textAlign: "center" }}>
        <Pagination
          current={currentPage}
          total={totalPolls}
          pageSize={10}
          onChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
