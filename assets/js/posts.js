const votes = document.querySelectorAll('.vote');

for (const el of votes) {
    el.addEventListener('click', e => {
        let currentTarget = e.currentTarget;
        currentTarget.classList.toggle('on');
        const post_id = currentTarget.dataset.postid;
        let url = `/posts/${post_id}/`;
        if (currentTarget.classList.contains('upvote')) {
            document.querySelector(`#downvote${post_id}`).classList.remove('on');
            url += 'upvote';
        } else {
            document.querySelector(`#upvote${post_id}`).classList.remove('on');
            url += 'downvote';
        }
        axios({
            method: 'put',
            url: url
        }).then((res) => {
            console.log(res);
            if (typeof (res.data) === "object") {
                document.querySelector(`#total_votes${res.data.post_id}`).innerHTML = res.data.total;
            };
        })
    })
}

