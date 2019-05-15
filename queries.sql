-- create the main tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(24) NOT NULL,
  unique_name VARCHAR(24) NOT NULL UNIQUE,
  password VARCHAR(60),
  email VARCHAR(64) UNIQUE,
  created TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE community (
  id SERIAL PRIMARY KEY,
  name VARCHAR(24) NOT NULL,
  unique_name VARCHAR(24) NOT NULL UNIQUE,
  meta VARCHAR(8192),
  createby INT REFERENCES users(id) ON DELETE SET NULL,
  created TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  owner INT REFERENCES users(id) ON DELETE SET NULL,
  ref_string VARCHAR(16) NOT NULL DEFAULT md5(random()::text)::varchar(16) UNIQUE,
  community INT REFERENCES community(id) ON DELETE SET NULL,
  title VARCHAR(256),
  link VARCHAR(256),
  content VARCHAR(16384),
  type VARCHAR(16),
  flag VARCHAR(16),
  throwaway BOOLEAN,
  hidden BOOLEAN,
  deleted BOOLEAN,
  edited TIMESTAMP WITHOUT TIME ZONE,
  created TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  owner INT REFERENCES users(id) ON DELETE SET NULL,
  ref_string VARCHAR(16) NOT NULL DEFAULT md5(random()::text)::varchar(16) UNIQUE,
  post_parent REFERENCES post(id),
  comment_parent REFERENCES comment(id),
  content VARCHAR(8192),
  throwaway BOOLEAN,
  hidden BOOLEAN,
  deleted BOOLEAN,
  edited TIMESTAMP WITHOUT TIME ZONE,
  created TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  community_id INT REFERENCES community(id) ON DELETE CASCADE,
  subscribed TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, community_id)
);

CREATE TABLE vote_post (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  post_id INT REFERENCES post(id) ON DELETE CASCADE,
  vote SMALLINT,
  voted TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE vote_comment (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  comment_id INT REFERENCES comment(id) ON DELETE CASCADE,
  vote SMALLINT,
  voted TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE save_post (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  post_id INT REFERENCES post(id) ON DELETE CASCADE,
  saved TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE save_comment (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  comment_id INT REFERENCES comment(id) ON DELETE CASCADE,
  saved TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);