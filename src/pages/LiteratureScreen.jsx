import React from 'react';

const LiteratureScreen = () => {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, options);

  // Hardcoded content for January 21, 2026 for now
  const justForToday = {
    title: "Unity and uniformity",
    page: "Page 21",
    quote: "Unity is a must in Narcotics Anonymous.",
    source: "Basic Text, p. 63",
    body: `Unity is not uniformity. Unity springs from the fact that we have unity of purpose—to recover, and to help others stay clean. Even so, we often find that while we strive to fulfill the same purpose, our means and methods may be radically different. We can't impose our ideas of unity on others or confuse unity with uniformity. In fact, a big attraction of the NA program is the absence of uniformity. Unity springs from our common purpose, not from standards imposed on the group by a few well-meaning members. A group that has the unity which springs from the loving hearts of its members allows each addict to carry the message in his or her own unique way. In our dealings with each other in NA, we sometimes disagree rather vocally. We must remember that the details of how we get things done isn't always important, so long as we keep our focus on the group's primary purpose. We can watch members who vehemently disagree over trivial things pull together when a newcomer reaches out for help. Someone was there for us when we got to the rooms of NA. Now it is our turn to be there for others. We need unity to help show the newcomer that this way of life works.`,
    reflection: "I will strive to be a part of unity. I know that unity does not equal uniformity."
  };

  const spiritualPrincipleADay = {
    title: "Exercising Goodwill",
    page: "Page 21",
    quote: "When we practice living in harmony with our world, we become wiser about choosing our battles. We learn where we can use our energy to make a difference and where we need to let go.",
    source: "Living Clean, Chapter 3, \"Awakening to Our Spirituality\"",
    body: `Let's start with an uncomfortable truth: We are judgmental because we are human. Human beings assess one another; we compare ourselves. We can be territorial and take sides. We come by this honestly; our survival once depended on it! Add the self-centered nature of addiction to our humanness, and then throw in something we care passionately about (such as the Fellowship of NA)—and our judgment can become a weapon to control outcomes about NA-related issues that other members also care about.We can, however, turn down the volume on our judgments. With the volume adjusted, we learn that we can approach people and situations without engaging our fight-or-flight instincts. Our first thoughts may still be judgmental, but recovery gives us options about our behavior. It's our actions that matter most.When we have some cleantime and service experience, it's tempting to tell members, groups, and service committees what's what. But having knowledge and wisdom doesn't give us authority. Group conscience is always more powerful than individual conscience. Sometimes—to our great surprise—newer members don't defer to those of us who have been around for a while, offering insights or suggestions the group had been missing before.Practicing the principle of goodwill with members doesn't mean we stay silent. Our opinions matter. Exercising goodwill assures those opinions don't matter more or less than anyone else's. We listen to others, don't force the outcome to meet our desires, allow others to make mistakes (yes, even the ones we have already made), and acknowledge that our fellow members want the same things as we do: to stay clean and to carry the message in the most effective way possible.Goodwill invokes our primary purpose. It serves the greater good of NA, not our egos.`,
    reflection: "I'll take a stance of goodwill toward others by sharing my experience, not dictating outcomes—and by demonstrating openness to the suggestions of others."
  };

  return (
    <div className="literature-container">
      <h2>Daily Meditations - {formattedDate}</h2>

      <div className="meditation-section">
        <h3>Just for Today</h3>
        <p className="meditation-quote">"{justForToday.quote}"</p>
        <p className="meditation-source"><em>— {justForToday.source}</em></p>
        <p>{justForToday.body}</p>
        <p className="meditation-reflection"><strong>Just for Today:</strong> {justForToday.reflection}</p>
      </div>

      <div className="meditation-section">
        <h3>A Spiritual Principle a Day</h3>
        <p className="meditation-quote">"{spiritualPrincipleADay.quote}"</p>
        <p className="meditation-source"><em>— {spiritualPrincipleADay.source}</em></p>
        <p>{spiritualPrincipleADay.body}</p>
        <p className="meditation-reflection"><strong>Principle Reflection:</strong> {spiritualPrincipleADay.reflection}</p>
      </div>
    </div>
  );
};

export default LiteratureScreen;
