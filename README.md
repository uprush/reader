Reader
======

Reader reads documents and extract important keywords in real-time. Here is an example chart created by Reader. It shows the top 25 most important keywords from [Jeff's blog](http://aws.amazon.com/blogs/aws/cloud-container-management/). Reader computes keyword scores just after a document is uploaded to S3 using AWS Lambda.

![Example Reader Chart](http://s3-ap-northeast-1.amazonaws.com/yifeng2-public/images/reader-dashboard.png)

# Technologies
- TF.IDF (Term Frequency times Inverse Document Frequency) *1
- AWS Services
  - S3 notification
  - AWS Lambda
  - DynamoDB
  
# Architecture
The architecture leverages AWS managed services. Zero server / EC2 instance required to run the application.

- Clients send text document to S3
- S3 notification triggers Lambda function called Reader
- Reader gets text from S3, calculate TF
- Reader gets IDF from DynamoDB
- Reader updates DynamoDB with new IDF
- Reader extracts important keywords using TFIDF
- Reader saves Top 25 keywords and stores into DynamoDB
- Reader-dashboard get keywords from DynamoDB and draw the charts

![Reader Architecture](http://s3-ap-northeast-1.amazonaws.com/yifeng2-public/images/reader-architecture.png)

# Code
Sample code on Github:

- [Reader](https://github.com/uprush/reader) *1
- [Reader Dashboard](https://github.com/uprush/reader-dashboard)

Sample AWS Lambda metrics:
![AWS Lambda Metrics](https://s3-ap-northeast-1.amazonaws.com/yifeng2-public/images/lambda-metrics.png)

*1 IDFi = log2(N/ni). Term exsistance data in other documents is required by IDF calculation, which is not implemented in this sample. The idea is to use DynamoDB to store the data.