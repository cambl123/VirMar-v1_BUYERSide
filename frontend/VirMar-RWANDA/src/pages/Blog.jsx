import React from 'react';

const BlogPage = () => {
  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Stay up-to-date with the latest news and updates from our community!</p>
      </div>
      <div className="blog-posts">
        <div className="blog-post">
          <div className="blog-image">
            <img src="https://via.placeholder.com/150" alt="Blog Image" />
          </div>
          <div className="blog-info">
            <h2>Blog Title</h2>
            <p>Blog Description</p>
            <p>Author: John Doe</p>
            <p>Date: January 1, 2022</p>
            <button className="read-more">Read More</button>
          </div>
        </div>
        <div className="blog-post">
          <div className="blog-image">
            <img src="https://via.placeholder.com/150" alt="Blog Image" />
          </div>
          <div className="blog-info">
            <h2>Blog Title</h2>
            <p>Blog Description</p>
            <p>Author: Jane Doe</p>
            <p>Date: January 15, 2022</p>
            <button className="read-more">Read More</button>
          </div>
        </div>
        <div className="blog-post">
          <div className="blog-image">
            <img src="https://via.placeholder.com/150" alt="Blog Image" />
          </div>
          <div className="blog-info">
            <h2>Blog Title</h2>
            <p>Blog Description</p>
            <p>Author: Bob Smith</p>
            <p>Date: February 1, 2022</p>
            <button className="read-more">Read More Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda aliquid perferendis molestiae illum non eos, doloribus molestias, dolores odit inventore aliquam quaerat animi dicta distinctio iusto dolorum quas. Suscipit, optio.</button>
          </div>
        </div>
      </div>
      <div className="pagination">
        <button className="prev-page">Previous Page</button>
        <button className="next-page">Next Page</button>
      </div>
    </div>
  );
};

export default BlogPage;